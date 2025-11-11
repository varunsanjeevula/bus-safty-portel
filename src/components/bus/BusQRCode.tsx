import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BusQRCodeProps {
  busId: string;
  busTitle?: string;
}

export function BusQRCode({ busId, busTitle }: BusQRCodeProps) {
  const qrValue = `${window.location.origin}/bus-qr/${busId}`;

  const downloadQRCode = () => {
    const svg = document.getElementById('bus-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `bus-${busId}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bus QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="bg-white p-6 rounded-lg">
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
        <Button onClick={downloadQRCode} variant="outline" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
}
