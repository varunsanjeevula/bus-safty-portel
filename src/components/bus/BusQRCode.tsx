import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface BusQRCodeProps {
  busId: string;
  busTitle?: string;
}

export function BusQRCode({ busId, busTitle }: BusQRCodeProps) {
  const qrValue = `${window.location.origin}/bus-qr/${busId}`;
  const [copied, setCopied] = useState(false);

  const downloadQRCode = () => {
    try {
      const svg = document.getElementById('bus-qr-code');
      if (!svg) {
        toast.error('QR code element not found');
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast.error('Could not get canvas context');
        return;
      }

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.download = `bus-${busId}-qr-code.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success('QR code downloaded successfully');
      };

      img.onerror = () => {
        toast.error('Failed to load QR code image');
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    }
  };

  const copyQRLink = () => {
    navigator.clipboard.writeText(qrValue).then(() => {
      setCopied(true);
      toast.success('QR link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const openQRLink = () => {
    window.open(qrValue, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bus QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <QRCodeSVG
            id="bus-qr-code"
            value={qrValue}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        {busTitle && (
          <p className="text-center text-sm text-muted-foreground font-medium">
            {busTitle}
          </p>
        )}
        <p className="text-center text-sm text-muted-foreground">
          Bus ID: <span className="font-mono font-semibold text-foreground">{busId}</span>
        </p>

        {/* URL Display */}
        <div className="w-full bg-muted p-3 rounded-lg text-xs break-all text-center text-muted-foreground">
          {qrValue}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <Button 
            onClick={downloadQRCode} 
            variant="default" 
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={copyQRLink} 
              variant="outline"
              className="w-full"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
            
            <Button 
              onClick={openQRLink} 
              variant="outline"
              className="w-full"
            >
              Open Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
