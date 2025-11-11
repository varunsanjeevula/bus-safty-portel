import { useEffect, useRef, useState } from "react";
import { BusLocation, BusStatus } from "@/services/mapService";
import { MAP_CONFIG, BUS_STATUS } from "@/lib/mapConfig";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MapPin, Users } from "lucide-react";

interface BusMapProps {
  center?: { lat: number; lng: number };
  busLocations?: BusLocation[];
  busStatus?: BusStatus;
  stops?: Array<{ id: string; name: string; lat: number; lng: number }>;
  routePolyline?: Array<{ lat: number; lng: number }>;
  userLocation?: { lat: number; lng: number };
  onBusClick?: (busId: string) => void;
  onStopClick?: (stopId: string) => void;
  zoom?: number;
  height?: string;
  showTrail?: boolean;
  showStops?: boolean;
}

export const BusMapSimple = ({
  center = MAP_CONFIG.defaultCenter,
  busLocations = [],
  busStatus,
  stops = [],
  routePolyline = [],
  userLocation,
  onBusClick,
  onStopClick,
  zoom = MAP_CONFIG.defaultZoom,
  height = "h-96",
  showTrail = true,
  showStops = true,
}: BusMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const trailPolylineRef = useRef<google.maps.Polyline | null>(null);
  const [apiKey] = useState(MAP_CONFIG.apiKey);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded yet. Retrying...");
      const retryTimeout = setTimeout(() => {
        if (window.google && window.google.maps) {
          console.log("Google Maps API loaded on retry");
        }
      }, 1000);
      return () => clearTimeout(retryTimeout);
    }

    console.log("Initializing map with center:", center);
    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom,
        center,
        ...MAP_CONFIG.mapOptions,
      });
      setMapReady(true);
      console.log("Map initialized successfully");
    } catch (error) {
      console.error("Failed to initialize map:", error);
    }
  }, []);

  // Update map center when center changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    mapInstanceRef.current.setCenter(center);
  }, [center, mapReady]);

  // Draw route polyline
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady || routePolyline.length === 0) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const path = routePolyline.map((coord) => new window.google.maps.LatLng(coord.lat, coord.lng));

    polylineRef.current = new window.google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: MAP_CONFIG.trackingConfig.polylineColor,
      strokeOpacity: MAP_CONFIG.trackingConfig.polylineOpacity,
      strokeWeight: MAP_CONFIG.trackingConfig.polylineWeight,
      map: mapInstanceRef.current,
    });
  }, [routePolyline, mapReady]);

  // Draw bus location trail
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady || !showTrail || busLocations.length === 0) return;

    if (trailPolylineRef.current) {
      trailPolylineRef.current.setMap(null);
    }

    const path = busLocations.map(
      (loc) => new window.google.maps.LatLng(loc.latitude, loc.longitude)
    );

    trailPolylineRef.current = new window.google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#9333ea",
      strokeOpacity: 0.4,
      strokeWeight: 2,
      map: mapInstanceRef.current,
    });
  }, [busLocations, showTrail, mapReady]);

  // Update bus markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    // Clear old markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current.clear();

    // Add bus markers
    busLocations.forEach((busLoc) => {
      const marker = new window.google.maps.Marker({
        position: { lat: busLoc.latitude, lng: busLoc.longitude },
        map: mapInstanceRef.current,
        title: `Bus ${busLoc.busId}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#3b82f6",
          fillOpacity: 0.8,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => {
        onBusClick?.(busLoc.busId);
      });

      markersRef.current.set(`bus-${busLoc.busId}`, marker);
    });

    // Add stop markers
    if (showStops) {
      stops.forEach((stop) => {
        const marker = new window.google.maps.Marker({
          position: { lat: stop.lat, lng: stop.lng },
          map: mapInstanceRef.current,
          title: stop.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: "#ef4444",
            fillOpacity: 0.6,
            strokeColor: "#fff",
            strokeWeight: 1,
          },
        });

        marker.addListener("click", () => {
          onStopClick?.(stop.id);
        });

        markersRef.current.set(`stop-${stop.id}`, marker);
      });
    }

    // Add user location marker
    if (userLocation) {
      const marker = new window.google.maps.Marker({
        position: userLocation,
        map: mapInstanceRef.current,
        title: "Your location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#10b981",
          fillOpacity: 0.8,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });

      markersRef.current.set("user-location", marker);
    }
  }, [busLocations, stops, userLocation, showStops, onBusClick, onStopClick, mapReady]);

  if (!apiKey) {
    return (
      <Card className="w-full p-6 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">Maps Not Configured</p>
            <p className="text-sm text-amber-700">
              Add VITE_GOOGLE_MAPS_API_KEY to your .env file to enable live tracking
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div
        ref={mapRef}
        className={`${height} rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center`}
      >
        {!mapReady && (
          <div className="text-center text-gray-500">
            <p className="text-sm">Loading map...</p>
          </div>
        )}
      </div>

      {/* Bus Status Info */}
      {busStatus && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Bus {busStatus.busId}</h3>
              <Badge
                variant="outline"
                className={`${
                  busStatus.status === BUS_STATUS.ON_TIME
                    ? "bg-green-50 text-green-700 border-green-200"
                    : busStatus.status === BUS_STATUS.DELAYED
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {busStatus.status === BUS_STATUS.ON_TIME
                  ? "On Time"
                  : busStatus.status === BUS_STATUS.DELAYED
                  ? `${busStatus.delayMinutes} min delay`
                  : busStatus.status.replace("_", " ")}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Current Stop</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {busStatus.currentStop?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Next Stop</p>
                <p className="font-semibold text-gray-900">{busStatus.nextStop?.name || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white rounded p-3 border border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">
                  {busStatus.passengersCount} / {busStatus.capacity}
                </span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(busStatus.passengersCount / busStatus.capacity) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Bus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Stop</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 bg-blue-500" />
          <span>Route</span>
        </div>
      </div>
    </div>
  );
};

export default BusMapSimple;
