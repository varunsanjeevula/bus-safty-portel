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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bus QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-2 border-gray-200">
          <QRCodeSVG
            id="bus-qr-code"
            value={qrValue}
            size={240}
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
        <div className="w-full bg-muted p-3 rounded-lg text-xs break-all text-center text-muted-foreground border border-border">
          {qrValue}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <Button 
            onClick={downloadQRCode} 
            variant="default" 
            className="w-full text-base py-6"
          >
            <Download className="h-5 w-5 mr-2" />
            Download QR Code
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={copyQRLink} 
              variant="outline"
              className="w-full py-5"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </Button>
            
            <Button 
              onClick={openQRLink} 
              variant="outline"
              className="w-full py-5"
            >
              Open Link
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="w-full bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-xs text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
          <p className="font-semibold mb-1">📱 How to use:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Download the QR code or Copy Link</li>
            <li>Scan with any QR code reader</li>
            <li>Opens bus details without login required</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
