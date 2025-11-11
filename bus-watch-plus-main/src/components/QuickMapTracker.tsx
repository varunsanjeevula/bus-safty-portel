import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserLocation } from '@/hooks/useUserLocation';
import { BusMap } from '@/components/BusMap';
import { calculateDistance, formatTimeRemaining, calculateETA } from '@/services/mapService';
import { MapPin, Navigation, Clock, AlertCircle, Loader } from 'lucide-react';
import { type BusStatus } from '@/lib/api';

interface QuickMapTrackerProps {
  busStatus?: BusStatus | null;
  onLocationChange?: (location: { lat: number; lng: number }) => void;
}

/**
 * Quick map tracker component showing user location and bus location
 * with distance and estimated time calculations
 */
export const QuickMapTracker = ({ busStatus, onLocationChange }: QuickMapTrackerProps) => {
  const { location: userLocation, error: locationError, loading: locationLoading } = useUserLocation({
    enableHighAccuracy: true,
    watchPosition: true,
  });

  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string>('Calculating...');

  // Mock bus location (Madurai, India)
  const BUS_LOCATION = { lat: 9.9252, lng: 78.1198 };

  // Calculate distance and time when user location changes
  useEffect(() => {
    if (userLocation) {
      onLocationChange?.(userLocation);

      // Calculate distance
      const distance = calculateDistance(userLocation, BUS_LOCATION, 'kilometers');
      setDistanceKm(distance);

      // Calculate ETA (40 km/h average bus speed)
      const eta = calculateETA(userLocation, BUS_LOCATION, 40);
      setEstimatedTime(formatTimeRemaining(eta));
    }
  }, [userLocation?.lat, userLocation?.lng]);

  return (
    <div className="space-y-4">
      {/* Map Section */}
      <Card className="overflow-hidden border-2 border-indigo-100">
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-600" />
            Live Bus Tracking Map
          </h2>
        </div>
        <div className="p-4">
          <BusMap 
            busStatus={busStatus || null} 
            userLocation={userLocation || null}
            height="h-96"
          />
        </div>
      </Card>

      {/* Location Error Alert */}
      {locationError && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-900">Location Access</h4>
              <p className="text-sm text-amber-700 mt-1">{locationError}</p>
              <p className="text-xs text-amber-600 mt-2">
                Make sure to allow location access in your browser settings for accurate distance and time calculations.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {locationLoading && !userLocation && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <Loader className="h-5 w-5 text-blue-600 animate-spin" />
            <p className="text-sm text-blue-700">Getting your location...</p>
          </div>
        </Card>
      )}

      {/* Distance and Time Information */}
      {userLocation && distanceKm !== null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Distance Card */}
          <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur">
                <Navigation className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-blue-100 text-sm mb-1">Distance to Bus</p>
                <p className="text-3xl font-bold">{distanceKm.toFixed(2)}</p>
                <p className="text-blue-100 text-xs mt-1">kilometers away</p>
              </div>
            </div>
          </Card>

          {/* Time Card */}
          <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur">
                <Clock className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-emerald-100 text-sm mb-1">Estimated Time</p>
                <p className="text-3xl font-bold">{estimatedTime}</p>
                <p className="text-emerald-100 text-xs mt-1">at 40 km/h average</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Info Box */}
      <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-600" />
            Location Information
          </h4>
          {userLocation && (
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Your Location:</span> {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
              <p className="flex items-center gap-2">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Mock Bus Location
                </Badge>
                Madurai, India (9.9252°N, 78.1198°E)
              </p>
              {userLocation.accuracy && (
                <p className="text-xs text-gray-600">
                  Accuracy: ±{userLocation.accuracy.toFixed(0)} meters
                </p>
              )}
            </div>
          )}
          {!userLocation && (
            <p className="text-sm text-gray-700">
              Enable location access to see your real-time position on the map and get accurate distance calculations.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuickMapTracker;
