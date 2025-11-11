import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { useBusStore } from '@/store/busStore';
import { Button } from '@/components/ui/button';
import { X, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileHeader } from '@/components/ProfileHeader';

const Scanner = () => {
  const navigate = useNavigate();
  const setCurrentBusId = useBusStore((state) => state.setCurrentBusId);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerIdRef = useRef('qr-reader');

  useEffect(() => {
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(readerIdRef.current);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Extract bus ID from QR code
            const busId = decodedText.includes('BUS-') ? decodedText : `BUS-${decodedText}`;
            
            // Vibrate on successful scan (if supported)
            if ('vibrate' in navigator) {
              navigator.vibrate(200);
            }
            
            setCurrentBusId(busId);
            toast.success('Bus QR Code scanned successfully!');
            
            // Stop scanner and navigate
            html5QrCode.stop().then(() => {
              navigate(`/bus/${busId}`);
            });
          },
          () => {
            // Scan error - ignore to avoid spam
          }
        );
        
        setIsScanning(true);
      } catch (err) {
        console.error('Failed to start scanner:', err);
        toast.error('Failed to access camera. Please allow camera permissions.');
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [navigate, setCurrentBusId]);

  const handleClose = () => {
    if (scannerRef.current && isScanning) {
      scannerRef.current.stop().then(() => {
        navigate('/');
      }).catch(() => {
        navigate('/');
      });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-40 flex flex-col">
      <ProfileHeader />
      
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-white" />
          <h1 className="text-xl font-bold text-white">Scan QR Code</h1>
        </div>
        <Button
          onClick={handleClose}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Scanner */}
      <div className="flex-1 flex items-center justify-center relative">
        <div id={readerIdRef.current} className="w-full max-w-md" />
        
        {/* Overlay Instructions */}
        <div className="absolute bottom-8 left-0 right-0 px-6 text-center">
          <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 inline-block">
            <p className="text-white text-sm font-medium">
              Position the QR code within the frame
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
