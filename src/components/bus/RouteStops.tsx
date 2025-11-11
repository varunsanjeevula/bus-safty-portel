import { useEffect, useState } from 'react';
import { getRouteStops, RouteStop } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RouteStopsProps {
  busId: string;
}

export function RouteStops({ busId }: RouteStopsProps) {
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        setLoading(true);
        const data = await getRouteStops(busId);
        setStops(data);
      } catch (error) {
        console.error('Failed to fetch route stops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, [busId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Route Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (stops.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Route Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No route information available</p>
        </CardContent>
      </Card>
    );
  }

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return 'Start';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Route Stops
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Route line */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary" />
          
          <div className="space-y-6">
            {stops.map((stop, index) => (
              <div key={stop.id} className="relative flex gap-4">
                {/* Stop marker */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-primary' : 
                    index === stops.length - 1 ? 'bg-secondary' : 
                    'bg-accent'
                  }`}>
                    <div className="w-3 h-3 bg-background rounded-full" />
                  </div>
                </div>

                {/* Stop info */}
                <div className="flex-1 pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {stop.stopName}
                      </h4>
                      {stop.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {stop.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                      <Clock className="h-4 w-4" />
                      {formatDuration(stop.durationMinutes)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
