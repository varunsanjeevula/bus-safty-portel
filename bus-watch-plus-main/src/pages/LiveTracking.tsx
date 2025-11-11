import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserLocation } from "@/hooks/useUserLocation";
// Temporarily disabled GPS tracking
// import { useGPSTracking, useUserLocation } from "@/hooks/useGPSTracking";
// import { BusMap } from "@/components/BusMap";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  Zap,
  ArrowLeft,
  RefreshCw,
  Share2,
  MapPinIcon,
} from "lucide-react";
import {
  calculateETA,
  calculateDistance,
  formatTimeRemaining,
  getDelayMessage,
  getOccupancyPercentage,
  BusStatus,
} from "@/services/mapService";
import { BUS_STATUS } from "@/lib/mapConfig";

interface BusWithDetails {
  id: string;
  number: string;
  route_name: string;
  capacity: number;
  operator?: string;
  contact?: string;
}

export const LiveTracking = () => {
  const { busId } = useParams<{ busId?: string }>();
  const navigate = useNavigate();

  const [busDetails, setBusDetails] = useState<BusWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Get user location with real-time updates
  const { location: userLocation } = useUserLocation({
    enableHighAccuracy: true,
    watchPosition: true,
  });

  // Temporarily disabled GPS tracking
  // const {
  //   locations,
  //   currentStatus,
  //   loading: trackingLoading,
  //   error: trackingError,
  //   fetchLocationHistory,
  // } = useGPSTracking({
  //   busId,
  //   enabled: !!busId,
  // });
  const locations = [];
  const currentStatus = null;
  const trackingLoading = false;
  const trackingError = null;

  // Fetch bus details
  useEffect(() => {
    const fetchBusDetails = async () => {
      if (!busId) {
        setError("Bus ID not found");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("buses")
          .select("*")
          .eq("bus_id", busId)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          setBusDetails({
            id: data.bus_id,
            number: data.route_number || "N/A",
            route_name: data.title || "Unknown Route",
            capacity: 50,
            operator: data.driver_name || "Unknown",
            contact: "Contact Support",
          });
        }

        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch bus details";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  // Calculate ETA
  const calculateEta = () => {
    if (!currentStatus || !locations.length) return null;

    const lastLocation = locations[0];
    const speed = lastLocation.speed || 30;

    return calculateETA(
      { lat: lastLocation.latitude, lng: lastLocation.longitude },
      {
        lat: currentStatus.nextStop.latitude,
        lng: currentStatus.nextStop.longitude,
      },
      speed
    );
  };

  const eta = calculateEta();

  // Get distance to next stop
  const getDistanceToNextStop = () => {
    if (!currentStatus || !locations.length) return null;

    const lastLocation = locations[0];
    return calculateDistance(
      { lat: lastLocation.latitude, lng: lastLocation.longitude },
      {
        lat: currentStatus.nextStop.latitude,
        lng: currentStatus.nextStop.longitude,
      },
      "kilometers"
    );
  };

  const distanceToNextStop = getDistanceToNextStop();

  // Share location
  const handleShareLocation = async () => {
    if (!busId) return;

    const shareText = `Track Bus ${busDetails?.number} on Bus Watch Plus\n${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bus ${busDetails?.number}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading || trackingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
            <RefreshCw className="h-6 w-6 text-primary animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading bus tracking...</p>
        </div>
      </div>
    );
  }

  if (error || trackingError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card className="p-6 bg-red-50 border-red-200">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-semibold text-red-900">Error Loading Bus</h2>
                <p className="text-red-700 mt-1">{error || trackingError}</p>
                <Button onClick={() => navigate("/")} className="mt-4">
                  Back to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentLocation = locations[0];
  const mapCenter = currentLocation
    ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bus {busDetails?.number}
              </h1>
              <p className="text-sm text-gray-600">{busDetails?.route_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleShareLocation}
              title="Share tracking link"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <ProfileHeader />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Map Section */}
        <Card className="overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-blue-600" />
                Live Bus Tracking
              </h2>
              <div className="flex items-center gap-2">
                {currentStatus && (
                  <Badge
                    variant="outline"
                    className={`${
                      currentStatus.status === BUS_STATUS.ON_TIME
                        ? "bg-green-50 text-green-700 border-green-200"
                        : currentStatus.status === BUS_STATUS.DELAYED
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {getDelayMessage(currentStatus.delayMinutes)}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.reload()}
                  className="hover:bg-white"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {/* Map section disabled - will be re-enabled after fixing type conflicts */}
          {/* <div className="p-4">
            <BusMap
              center={mapCenter}
              busLocations={currentLocation ? [currentLocation] : []}
              busStatus={currentStatus || undefined}
              userLocation={userLocation || undefined}
              showTrail={true}
              height="h-96"
            />
          </div> */}
        </Card>

        {/* Bus Status Grid */}
        {currentStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Stop */}
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Stop</p>
                  <p className="font-semibold text-gray-900 text-lg line-clamp-2">
                    {currentStatus.currentStop.name}
                  </p>
                </div>
              </div>
            </Card>

            {/* Next Stop */}
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Stop</p>
                  <p className="font-semibold text-gray-900 text-lg line-clamp-2">
                    {currentStatus.nextStop.name}
                  </p>
                </div>
              </div>
            </Card>

            {/* ETA */}
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ETA</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {eta ? formatTimeRemaining(eta) : "Calculating..."}
                  </p>
                  {distanceToNextStop && (
                    <p className="text-xs text-gray-500 mt-1">
                      {distanceToNextStop.toFixed(1)} km away
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Occupancy */}
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Occupancy</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {getOccupancyPercentage(
                      currentStatus.passengersCount,
                      currentStatus.capacity
                    )}
                    %
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentStatus.passengersCount} / {currentStatus.capacity}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Detailed Information */}
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Bus Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Bus Number</p>
                  <p className="font-semibold text-gray-900">
                    {busDetails?.number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Route</p>
                  <p className="font-semibold text-gray-900">
                    {busDetails?.route_name}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="font-semibold text-gray-900">
                    {busDetails?.capacity} seats
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Operator</p>
                  <p className="font-semibold text-gray-900">
                    {busDetails?.operator || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          {busDetails?.contact && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Contact Operator</h4>
              <a
                href={`tel:${busDetails.contact}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                <Zap className="h-4 w-4" />
                {busDetails.contact}
              </a>
            </div>
          )}
        </Card>

        {/* Auto Refresh Toggle */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-700">Auto-refresh enabled</p>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
              Updates every 5 seconds
            </Badge>
          </div>
        </Card>

        {/* Info Box */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Location updates in real-time. Make sure to allow location access in your browser settings for the best experience.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LiveTracking;
