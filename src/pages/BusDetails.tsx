import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import LiveStatus from '@/components/bus/LiveStatus';
import SafetyHistory from '@/components/bus/SafetyHistory';
import SubmitFeedback from '@/components/bus/SubmitFeedback';
import { RouteStops } from '@/components/bus/RouteStops';
import { BusQRCode } from '@/components/bus/BusQRCode';
import { ProfileHeader } from '@/components/ProfileHeader';
import { useEffect, useState } from 'react';
import { getBusStatus } from '@/lib/api';

interface BusDetailsProps {
  isPublic?: boolean;
}

const BusDetails = ({ isPublic = false }: BusDetailsProps) => {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();
  const [busTitle, setBusTitle] = useState<string>('');

  useEffect(() => {
    const fetchBusTitle = async () => {
      if (busId) {
        try {
          const status = await getBusStatus(busId);
          if (status.title) {
            setBusTitle(status.title);
          }
        } catch (error) {
          console.error('Failed to fetch bus title:', error);
        }
      }
    };
    fetchBusTitle();
  }, [busId]);

  if (!busId) {
    navigate('/');
    return null;
  }

  const content = (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {!isPublic && <ProfileHeader />}
      
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="icon"
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 flex-1">
              <div className="bg-primary rounded-lg p-1.5">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">
                  {busTitle || `Bus ${busId}`}
                </h1>
                <p className="text-xs text-muted-foreground">Bus ID: {busId}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="status" className="text-xs sm:text-sm">
              Status
            </TabsTrigger>
            <TabsTrigger value="route" className="text-xs sm:text-sm">
              Route
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              History
            </TabsTrigger>
            <TabsTrigger value="qr" className="text-xs sm:text-sm">
              QR Code
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs sm:text-sm">
              Feedback
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="mt-0">
            <LiveStatus busId={busId} />
          </TabsContent>
          
          <TabsContent value="route" className="mt-0">
            <RouteStops busId={busId} />
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <SafetyHistory busId={busId} />
          </TabsContent>
          
          <TabsContent value="qr" className="mt-0">
            <BusQRCode busId={busId} busTitle={busTitle} />
          </TabsContent>
          
          <TabsContent value="feedback" className="mt-0">
            <SubmitFeedback busId={busId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );

  return content;
};

export default BusDetails;
