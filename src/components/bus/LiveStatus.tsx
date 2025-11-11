import { useEffect, useState } from 'react';
import { getBusStatus, type BusStatus } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Gauge, Clock, User, MapPin, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Suspense, lazy } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';

// Lazy load the map to prevent blocking
const BusMap = lazy(() => import('@/components/BusMap'));

interface LiveStatusProps {
  busId: string;
}

const LiveStatus = ({ busId }: LiveStatusProps) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<BusStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Get user location
  const { location: userLocation } = useUserLocation({
    enableHighAccuracy: true,
    watchPosition: true,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getBusStatus(busId);
        setStatus(data);
        
        // Only set loading to false on initial load
        if (isInitialLoad) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      } catch (error) {
        toast.error('Failed to load bus status');
        console.error(error);
        
        if (isInitialLoad) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    // Fetch immediately
    fetchStatus();
    
    // Auto-refresh every 30 seconds (increased from 10s to reduce reloads)
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [busId, isInitialLoad]);

  const getStatusColor = (status?: 'active' | 'stopped' | 'maintenance') => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'stopped':
        return 'text-warning';
      case 'maintenance':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status?: 'active' | 'stopped' | 'maintenance') => {
    switch (status) {
      case 'active':
        return 'bg-success/10';
      case 'stopped':
        return 'bg-warning/10';
      case 'maintenance':
        return 'bg-destructive/10';
      default:
        return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-20" />
        </Card>
      </div>
    );
  }

  if (!status) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Failed to load bus status</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* GPS Tracking Map */}
      {status && (
        <Suspense fallback={<Card className="p-6 h-96 animate-pulse bg-gray-100" />}>
          <BusMap 
            busStatus={status} 
            userLocation={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null}
            height="h-96" 
          />
        </Suspense>
      )}

      {/* Speed Display */}
      <Card className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mb-4 relative">
          <Gauge className="w-16 h-16 text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center mt-8">
              <p className="text-3xl font-bold text-primary">{status.speed}</p>
              <p className="text-xs text-muted-foreground">km/h</p>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Current Speed</h3>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusBg(status.status)}`}>
          <Activity className={`w-4 h-4 ${getStatusColor(status.status)}`} />
          <span className={`text-sm font-semibold ${getStatusColor(status.status)} capitalize`}>
            {status.status}
          </span>
        </div>
      </Card>

      {/* Bus Information */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Bus Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="bg-primary/10 rounded-lg p-2">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Route</p>
              <p className="text-sm font-semibold text-foreground">{status.routeNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="bg-primary/10 rounded-lg p-2">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Driver</p>
              <p className="text-sm font-semibold text-foreground">{status.driverName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="bg-primary/10 rounded-lg p-2">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm font-semibold text-foreground">
                {new Date(status.lastUpdate).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Report Incident Button */}
      <Button
        onClick={() => navigate(`/bus/${busId}/incident`)}
        variant="destructive"
        size="lg"
        className="w-full h-14 text-base font-semibold"
      >
        <AlertTriangle className="w-5 h-5 mr-2" />
        Report Safety Incident
      </Button>
    </div>
  );
};

export default LiveStatus;
