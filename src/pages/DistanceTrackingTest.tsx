import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserLocation } from '@/hooks/useUserLocation';
import { BusMap } from '@/components/BusMap';
import { Directions } from '@/components/Directions';
import { AlertCircle, MapPin, Navigation, Loader, Map } from 'lucide-react';
import { type BusStatus } from '@/lib/api';

/**
 * Test page to demonstrate distance and time tracking
 * Shows your real location and bus location (Madurai mock) on the map
 */
export const DistanceTrackingTest = () => {
  const { location: userLocation, error: locationError, loading: locationLoading } = useUserLocation({
    enableHighAccuracy: true,
    watchPosition: true,
  });

  const [showDirections, setShowDirections] = useState(true);

  // Mock bus status
  const mockBusStatus: BusStatus = {
    busId: 'BUS-001',
    speed: 45,
    lastUpdate: new Date().toISOString(),
    driverName: 'John Doe',
    routeNumber: 'Route 5',
    status: 'active',
    title: 'City Bus - Route 5',
  };

  // Mock bus location
  const BUS_LOCATION = { lat: 9.9252, lng: 78.1198 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            📍 Distance & Time Tracking Demo
          </h1>
          <p className="text-gray-600 text-lg">
            See your real location and the bus location on the map with distance calculation
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Your Location Card */}
          <Card className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Navigation className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Your Location</h3>
                {locationLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader className="h-4 w-4 animate-spin" />
                    Getting location...
                  </div>
                )}
                {locationError && (
                  <div className="text-sm text-amber-600">
                    ⚠️ {locationError}
                  </div>
                )}
                {userLocation && (
                  <div className="text-sm space-y-1">
                    <p className="text-gray-700">
                      <span className="font-medium">Lat:</span> {userLocation.lat.toFixed(4)}°
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Lng:</span> {userLocation.lng.toFixed(4)}°
                    </p>
                    {userLocation.accuracy && (
                      <p className="text-xs text-gray-600">
                        Accuracy: ±{userLocation.accuracy.toFixed(0)}m
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Bus Location Card */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Bus Location (Mock)</h3>
                <div className="text-sm space-y-1">
                  <p className="text-gray-700">
                    <span className="font-medium">Location:</span> Madurai, India
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Lat:</span> 9.9252°N
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Lng:</span> 78.1198°E
                  </p>
                  <Badge className="mt-2 bg-amber-100 text-amber-700 border-amber-200">
                    Mock Location for Testing
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">How It Works</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Your location is shown as a <strong>GREEN marker</strong></li>
                <li>✅ Bus location is shown as a <strong>BLUE bus icon</strong></li>
                <li>✅ A <strong>dashed line</strong> connects the two points</li>
                <li>✅ Distance and estimated time are shown below the map</li>
                <li>✅ All updates happen in real-time as you move</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* The Interactive Map */}
        <Card className="overflow-hidden border-2 border-indigo-200 shadow-lg">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />
              Interactive Map - Your Location vs Bus Location
            </h2>
          </div>
          
          <div className="p-4">
            {locationError ? (
              <Card className="p-6 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-900">Location Permission Required</h4>
                    <p className="text-sm text-amber-800 mt-1">{locationError}</p>
                    <p className="text-sm text-amber-700 mt-2">
                      To see the map with your location:
                    </p>
                    <ol className="text-sm text-amber-700 list-decimal list-inside mt-2 space-y-1">
                      <li>Allow location access when prompted by your browser</li>
                      <li>Or enable location in your browser settings</li>
                      <li>Then refresh the page</li>
                    </ol>
                  </div>
                </div>
              </Card>
            ) : (
              <BusMap 
                busStatus={mockBusStatus}
                userLocation={userLocation}
                height="h-96"
              />
            )}
          </div>
        </Card>

        {/* Toggle Directions Button */}
        {userLocation && (
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => setShowDirections(!showDirections)}
              variant={showDirections ? "default" : "outline"}
              className="gap-2"
            >
              <Map className="h-4 w-4" />
              {showDirections ? 'Hide' : 'Show'} Directions
            </Button>
          </div>
        )}

        {/* Turn-by-Turn Directions */}
        {userLocation && showDirections && (
          <Card className="overflow-hidden border-2 border-blue-200 shadow-lg mt-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                Turn-by-Turn Directions to Bus
              </h2>
            </div>
            
            <div className="p-4">
              <Directions 
                userLocation={userLocation}
                busLocation={BUS_LOCATION}
              />
            </div>
          </Card>
        )}

        {/* Instructions for Testing */}
        <Card className="mt-6 p-4 bg-purple-50 border-purple-200">
          <h3 className="font-semibold text-gray-900 mb-3">🧪 Testing Instructions</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>1. Allow Location:</strong> When your browser asks for permission, click <strong>"Allow"</strong> to share your GPS location.
            </p>
            <p>
              <strong>2. View the Map:</strong> The map shows your location (green dot) and the bus location in Madurai (blue icon).
            </p>
            <p>
              <strong>3. See Distance:</strong> Below the map, you'll see the distance and estimated time to reach the bus.
            </p>
            <p>
              <strong>4. Move Around:</strong> Walk or drive around and watch the distance and time update in real-time.
            </p>
            <p>
              <strong>5. Zoom & Pan:</strong> Use map controls to zoom in/out and pan around to see both locations clearly.
            </p>
          </div>
        </Card>

        {/* Data Display */}
        {userLocation && (
          <Card className="mt-6 p-4 bg-green-50 border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">📊 Live Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-lg border border-green-100">
                <p className="text-xs text-gray-600">Your Latitude</p>
                <p className="text-lg font-bold text-green-600">{userLocation.lat.toFixed(4)}°</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-green-100">
                <p className="text-xs text-gray-600">Your Longitude</p>
                <p className="text-lg font-bold text-green-600">{userLocation.lng.toFixed(4)}°</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-green-100">
                <p className="text-xs text-gray-600">Accuracy</p>
                <p className="text-lg font-bold text-green-600">
                  ±{userLocation.accuracy?.toFixed(0) || '?'}m
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Additional Info */}
        <Card className="mt-6 p-4 bg-indigo-50 border-indigo-200">
          <h3 className="font-semibold text-gray-900 mb-3">ℹ️ What's Happening</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              ✅ <strong>Browser Geolocation API:</strong> Gets your real GPS location with high accuracy
            </li>
            <li>
              ✅ <strong>Haversine Formula:</strong> Calculates accurate distance between two points on Earth
            </li>
            <li>
              ✅ <strong>Mock Bus Location:</strong> Madurai (9.9252°N, 78.1198°E) is used for demonstration
            </li>
            <li>
              ✅ <strong>Real-Time Updates:</strong> Location updates continuously as you move
            </li>
            <li>
              ✅ <strong>Estimated Time:</strong> Calculated based on distance and 40 km/h average bus speed
            </li>
            <li>
              ✅ <strong>Interactive Map:</strong> Leaflet + OpenStreetMap (no API key required)
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default DistanceTrackingTest;
