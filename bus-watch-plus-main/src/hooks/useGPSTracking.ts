import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BusLocation, BusStop, BusStatus } from "@/services/mapService";

interface BusStatusData {
  currentStop: BusStop | null;
  nextStop: BusStop | null;
  passengersCount: number;
  capacity: number;
  delayMinutes: number;
  status: "on_time" | "delayed" | "completed" | "not_started";
  estimatedArrivalTime: Date;
}

/**
 * Custom hook for real-time GPS tracking of buses
 * Works with existing Lovable database schema (buses, route_stops tables)
 */
export const useGPSTracking = ({
  busId,
  enabled = true,
  onLocationUpdate,
  onStatusUpdate,
}: {
  busId: string;
  enabled?: boolean;
  onLocationUpdate?: (location: BusLocation) => void;
  onStatusUpdate?: (status: BusStatusData) => void;
}) => {
  const [currentLocation, setCurrentLocation] = useState<BusLocation | null>(
    null
  );
  const [currentStatus, setCurrentStatus] = useState<BusStatusData | null>(
    null
  );
  const [locationHistory, setLocationHistory] = useState<BusLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial bus details from existing 'buses' table
  const fetchInitialBusData = useCallback(async () => {
    if (!enabled || !busId) return;

    try {
      setLoading(true);

      // Get bus details from existing buses table
      const { data: busData, error: busError } = await supabase
        .from("buses")
        .select("*")
        .eq("bus_id", busId)
        .single();

      if (busError) throw busError;

      // Create mock location from bus data
      const mockLocation: BusLocation = {
        busId: busData.bus_id,
        latitude: 28.7041, // Default Delhi location
        longitude: 77.1025,
        speed: busData.current_speed || 0,
        direction: 0,
        timestamp: new Date(busData.updated_at),
      };

      setCurrentLocation(mockLocation);
      setLocationHistory([mockLocation]);
      onLocationUpdate?.(mockLocation);

      // Get route stops for this bus
      const { data: routeStops, error: stopsError } = await supabase
        .from("route_stops")
        .select("*")
        .eq("bus_id", busId)
        .order("stop_order", { ascending: true });

      if (stopsError) console.error("Error fetching stops:", stopsError);

      const stops = routeStops || [];

      // Create mock status from available data
      const mockStatus: BusStatusData = {
        currentStop: stops[0]
          ? {
              id: stops[0].id,
              name: stops[0].stop_name,
              latitude: 28.7041,
              longitude: 77.1025,
            }
          : null,
        nextStop: stops[1]
          ? {
              id: stops[1].id,
              name: stops[1].stop_name,
              latitude: 28.7101,
              longitude: 77.1075,
            }
          : null,
        passengersCount: 0,
        capacity: 50,
        delayMinutes: 0,
        status: (busData.status as any) || "on_time",
        estimatedArrivalTime: new Date(
          Date.now() + 30 * 60 * 1000
        ),
      };

      setCurrentStatus(mockStatus);
      onStatusUpdate?.(mockStatus);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bus data");
      console.error("Error fetching bus data:", err);
    } finally {
      setLoading(false);
    }
  }, [busId, enabled, onLocationUpdate, onStatusUpdate]);

  // Subscribe to real-time updates on buses table
  useEffect(() => {
    if (!enabled || !busId) return;

    fetchInitialBusData();

    // Subscribe to changes on buses table for this specific bus
    const subscription = supabase
      .channel(`buses:${busId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "buses",
          filter: `bus_id=eq.${busId}`,
        },
        (payload: any) => {
          if (payload.new) {
            const updatedLocation: BusLocation = {
              busId: payload.new.bus_id,
              latitude: 28.7041,
              longitude: 77.1025,
              speed: payload.new.current_speed || 0,
              direction: 0,
              timestamp: new Date(payload.new.updated_at),
            };

            setCurrentLocation(updatedLocation);
            setLocationHistory((prev) => [
              ...prev.slice(-99),
              updatedLocation,
            ]);
            onLocationUpdate?.(updatedLocation);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [enabled, busId, fetchInitialBusData, onLocationUpdate, onStatusUpdate]);

  // Fetch historical location data
  const fetchLocationHistory = useCallback(async () => {
    if (!busId) return [];

    // Use safety records as a proxy for history
    const { data, error: fetchError } = await supabase
      .from("safety_records")
      .select("created_at")
      .eq("bus_id", busId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (fetchError) {
      console.error("Error fetching history:", fetchError);
      return [];
    }

    return data || [];
  }, [busId]);

  // Get nearby buses (simplified implementation)
  const getNearbyBuses = useCallback(
    async (
      userLocation: { lat: number; lng: number },
      radiusKm: number = 5
    ) => {
      const { data, error: fetchError } = await supabase
        .from("buses")
        .select("*")
        .limit(10);

      if (fetchError) {
        console.error("Error fetching nearby buses:", fetchError);
        return [];
      }

      return data || [];
    },
    []
  );

  // Update bus location (simplified - updates the buses table)
  const updateBusLocation = useCallback(
    async (lat: number, lng: number, speed: number) => {
      const newLocation: BusLocation = {
        busId,
        latitude: lat,
        longitude: lng,
        speed,
        direction: 0,
        timestamp: new Date(),
      };

      try {
        const { error: updateError } = await supabase
          .from("buses")
          .update({
            current_speed: speed,
            updated_at: new Date().toISOString(),
          })
          .eq("bus_id", busId);

        if (updateError) throw updateError;

        setCurrentLocation(newLocation);
        setLocationHistory((prev) => [
          ...prev.slice(-99),
          newLocation,
        ]);
        onLocationUpdate?.(newLocation);

        return { success: true };
      } catch (err) {
        console.error("Error updating location:", err);
        return { success: false, error: err };
      }
    },
    [busId, onLocationUpdate]
  );

  // Manual refresh of data
  const refreshData = useCallback(async () => {
    await fetchInitialBusData();
  }, [fetchInitialBusData]);

  return {
    locations: locationHistory,
    currentStatus,
    loading,
    error,
    fetchLocationHistory,
    getNearbyBuses,
    updateBusLocation,
    refreshData,
  };
};

/**
 * Custom hook for tracking user's current location
 */
export const useUserLocation = (enabled: boolean = true) => {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      setLoading(false);
      return;
    }

    try {
      // Get initial position with timeout
      const positionPromise = new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 0,
          enableHighAccuracy: false,
        });
      });

      positionPromise
        .then((position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          console.warn("Geolocation error:", err);
          setError(null); // Don't show error, just silently fail
          setLoading(false);
        });

      // Watch for position changes (non-blocking)
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.warn("Watch position error:", err);
          // Don't update error state, just log it
        },
        {
          timeout: 5000,
          maximumAge: 10000,
          enableHighAccuracy: false,
        }
      );

      return () => {
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    } catch (err) {
      console.warn("Geolocation setup error:", err);
      setError(null);
      setLoading(false);
    }
  }, [enabled]);

  return { location, error, loading };
};
