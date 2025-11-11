import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Privacy Policy</h2>
          
          <div className="prose prose-sm max-w-none space-y-6 text-foreground">
            <section>
              <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
              <p className="text-muted-foreground leading-relaxed">
                We collect information that you provide when using our bus safety tracking service, 
                including bus IDs, feedback, incident reports, and optional photos. We also collect 
                device information for improving app functionality.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your information is used to monitor bus safety, respond to incidents, improve service 
                quality, and ensure passenger safety. We share data only with authorized personnel and 
                relevant authorities when necessary.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Camera Access</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our app requests camera access solely for QR code scanning functionality. No photos 
                or videos are captured or stored without your explicit consent when submitting 
                feedback or incident reports.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Data Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your information. All data 
                transmission is encrypted, and access is restricted to authorized personnel only.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, modify, or delete your personal information at any time. 
                Contact our support team for assistance with privacy-related requests.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at 
                privacy@bussafety.com
              </p>
            </section>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Last updated: November 6, 2025
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Privacy;
