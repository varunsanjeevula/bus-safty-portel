import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader, MapPin, Navigation, AlertCircle, ChevronRight, Gauge, Clock } from 'lucide-react';

interface DirectionStep {
  distance: number;
  duration: number;
  instruction: string;
  name: string;
  way_name?: string;
}

interface DirectionsProps {
  userLocation: { lat: number; lng: number } | null;
  busLocation: { lat: number; lng: number };
  onDirectionsReceived?: (steps: DirectionStep[], distance: number, duration: number) => void;
}

/**
 * Directions component showing turn-by-turn navigation
 * Uses OpenRouteService API for routing
 */
export const Directions = ({ userLocation, busLocation, onDirectionsReceived }: DirectionsProps) => {
  const [steps, setSteps] = useState<DirectionStep[]>([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Fetch directions using OpenRouteService
  useEffect(() => {
    const fetchDirections = async () => {
      if (!userLocation) {
        setError('Your location not available');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // OpenRouteService free routing API
        // Format: [longitude, latitude] for routing APIs
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?` +
          `start=${userLocation.lng},${userLocation.lat}&` +
          `end=${busLocation.lng},${busLocation.lat}`,
          {
            headers: {
              'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch directions');
        }

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const segments = route.segments || [];
          
          // Parse steps from segments
          const parsedSteps: DirectionStep[] = [];
          let stepCounter = 0;

          segments.forEach((segment: any) => {
            const steps_in_segment = segment.steps || [];
            steps_in_segment.forEach((step: any) => {
              parsedSteps.push({
                distance: step.distance || 0,
                duration: step.duration || 0,
                instruction: step.instruction || 'Continue',
                name: step.name || 'Street',
                way_name: step.way_name,
              });
            });
          });

          // If no steps found, create a simple summary step
          if (parsedSteps.length === 0) {
            const distance = route.summary?.distance || 0;
            const duration = route.summary?.duration || 0;
            parsedSteps.push({
              distance: distance,
              duration: duration,
              instruction: 'Head towards the destination',
              name: 'Route to Bus',
            });
          }

          setSteps(parsedSteps);
          setTotalDistance(route.summary?.distance || 0);
          setTotalDuration(route.summary?.duration || 0);
          onDirectionsReceived?.(parsedSteps, route.summary?.distance || 0, route.summary?.duration || 0);
        }
      } catch (err) {
        console.error('Directions error:', err);
        // Fallback: use simple distance-based estimate
        const lat1 = userLocation.lat * Math.PI / 180;
        const lat2 = busLocation.lat * Math.PI / 180;
        const deltaLat = (busLocation.lat - userLocation.lat) * Math.PI / 180;
        const deltaLng = (busLocation.lng - userLocation.lng) * Math.PI / 180;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = 6371 * c * 1000; // Distance in meters

        setSteps([
          {
            distance: distance,
            duration: (distance / 15) * 60, // Assuming 15 m/s average
            instruction: 'Navigate towards the bus location',
            name: 'Estimated Route',
          },
        ]);
        setTotalDistance(distance);
        setTotalDuration((distance / 15) * 60);
      } finally {
        setLoading(false);
      }
    };

    fetchDirections();
  }, [userLocation?.lat, userLocation?.lng, busLocation.lat, busLocation.lng]);

  if (!userLocation) {
    return (
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-900">Location Required</h4>
            <p className="text-sm text-amber-700">Enable location access to see directions</p>
          </div>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Loader className="h-5 w-5 text-indigo-600 animate-spin" />
          <p className="text-sm text-gray-600">Loading directions...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-900">Directions Error</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 1) return 'Less than 1 min';
    if (minutes === 1) return '1 min';
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">Total Distance</p>
            <p className="text-2xl font-bold">{formatDistance(totalDistance)}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Estimated Time</p>
            <p className="text-2xl font-bold">{formatTime(totalDuration)}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Steps</p>
            <p className="text-2xl font-bold">{steps.length}</p>
          </div>
        </div>
      </Card>

      {/* Directions List */}
      <Card className="p-0 border-2 border-indigo-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 border-b border-indigo-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-indigo-600" />
            Turn-by-Turn Directions
          </h3>
        </div>

        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setExpandedStep(expandedStep === index ? null : index)}
            >
              <div className="flex items-start gap-4">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>

                {/* Instruction */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {step.instruction}
                  </p>
                  {step.way_name && (
                    <p className="text-sm text-gray-600 mt-1">
                      on {step.way_name}
                    </p>
                  )}
                  {step.name && step.name !== step.way_name && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {step.name}
                    </p>
                  )}
                </div>

                {/* Distance & Time */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-indigo-600">
                    {formatDistance(step.distance)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatTime(step.duration)}
                  </p>
                </div>

                {/* Expand Icon */}
                <ChevronRight
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedStep === index ? 'transform rotate-90' : ''
                  }`}
                />
              </div>

              {/* Expanded Details */}
              {expandedStep === index && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    <span>{step.way_name || 'On route'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-indigo-600" />
                    <span>Distance: {formatDistance(step.distance)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <span>Duration: {formatTime(step.duration)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Final Destination */}
      <Card className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100">
            <MapPin className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Bus Location</p>
            <p className="text-sm text-gray-600">
              Madurai, India • 9.9252°N, 78.1198°E
            </p>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card className="p-3 bg-blue-50 border-blue-200">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Click on any step to see more details. The route is calculated for driving, but works for walking or public transit too.
        </p>
      </Card>
    </div>
  );
};

export default Directions;
