import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitIncident } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Send, AlertTriangle, Camera, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileHeader } from '@/components/ProfileHeader';
import { supabase } from '@/integrations/supabase/client';

const incidentCategories = [
  'Unsafe Driving',
  'Equipment Failure',
  'Accident',
  'Medical Emergency',
  'Harassment',
  'Other Safety Concern',
];

const severityLevels = ['Low', 'Medium', 'High', 'Critical'];

const ReportIncident = () => {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [driverRating, setDriverRating] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!busId) {
    navigate('/');
    return null;
  }

  // Initialize camera
  useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [showCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error('Unable to access camera');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = async () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `incident-${Date.now()}.jpg`, { type: 'image/jpeg' });
            addImage(file);
            setShowCamera(false);
            toast.success('Photo captured');
          }
        });
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => addImage(file));
    }
  };

  const addImage = (file: File) => {
    if (images.length >= 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setImages([...images, file]);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrls([...previewUrls, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast.error('Please select an incident category');
      return;
    }

    if (!severity) {
      toast.error('Please select incident severity');
      return;
    }

    if (!description.trim()) {
      toast.error('Please provide a description of the incident');
      return;
    }

    try {
      setSubmitting(true);

      // Upload images to Supabase storage
      const uploadedImageUrls: string[] = [];
      for (const image of images) {
        const fileName = `incident-${busId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
        const { error } = await supabase.storage
          .from('incident-images')
          .upload(fileName, image);

        if (!error) {
          const { data } = supabase.storage
            .from('incident-images')
            .getPublicUrl(fileName);
          uploadedImageUrls.push(data.publicUrl);
        }
      }

      // Save to incidents table
      await supabase
        .from('incidents')
        .insert({
          bus_id: busId,
          category: selectedCategory,
          description,
          image_url: uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : null,
          image_urls: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
        });

      toast.success('Incident report submitted successfully');
      navigate(`/bus/${busId}`);
    } catch (error) {
      toast.error('Failed to submit incident report');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-slate-50">
      <ProfileHeader />

      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-red-200 sticky top-16 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate(`/bus/${busId}`)}
              variant="ghost"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-lg p-2">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Report Safety Incident</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-3xl pb-24 md:pb-8">
        {/* Emergency Notice */}
        <Card className="p-4 mb-6 bg-red-50 border-2 border-red-200">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Important Safety Notice</h3>
              <p className="text-sm text-red-700">
                For immediate emergencies, please call emergency services (911). This form is for
                reporting safety concerns that require investigation and documentation.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {/* Incident Category */}
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Incident Category</h3>
            <div className="flex flex-wrap gap-2">
              {incidentCategories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'destructive' : 'outline'}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white'
                      : 'hover:bg-red-50 border-red-200'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Severity Level */}
          <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Incident Severity</h3>
            <div className="flex flex-wrap gap-2">
              {severityLevels.map((level, idx) => {
                const colors = [
                  'bg-yellow-100 text-yellow-700 border-yellow-300',
                  'bg-orange-100 text-orange-700 border-orange-300',
                  'bg-red-100 text-red-700 border-red-300',
                  'bg-rose-100 text-rose-700 border-rose-300',
                ];
                return (
                  <Badge
                    key={level}
                    variant={severity === level ? 'default' : 'outline'}
                    className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                      severity === level ? colors[idx] : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSeverity(level)}
                  >
                    {level}
                  </Badge>
                );
              })}
            </div>
          </Card>

          {/* Driver Behavior Rating */}
          <Card className="p-6 border-0 shadow-lg">
            <Label className="text-base font-semibold mb-4 block text-gray-900">
              Driver Behavior (1 = Unsafe, 5 = Safe)
            </Label>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setDriverRating(rating)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating <= driverRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {driverRating > 0
                ? `Driver behavior rating: ${driverRating} / 5`
                : 'Rate the driver behavior'}
            </p>
          </Card>

          {/* Description */}
          <Card className="p-6 border-0 shadow-lg">
            <Label htmlFor="description" className="text-base font-semibold mb-3 block text-gray-900">
              Incident Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Please describe the incident in detail including what happened, when, and where..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-40 resize-none border-2 border-gray-200 focus:border-red-400"
              required
            />
          </Card>

          {/* Image Preview */}
          {previewUrls.length > 0 && (
            <Card className="p-6 border-0 shadow-lg">
              <Label className="text-base font-semibold mb-3 block text-gray-900">
                Evidence Photos ({previewUrls.length}/10)
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${idx}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Camera and Upload Section */}
          <Card className="p-6 border-0 shadow-lg">
            <Label className="text-base font-semibold mb-4 block text-gray-900">
              Add Evidence Photos
            </Label>

            {showCamera ? (
              <div className="space-y-3">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg bg-black"
                />
                <canvas ref={canvasRef} className="hidden" width="640" height="480" />
                <div className="flex gap-3">
                  <Button
                    onClick={capturePhoto}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture Photo
                  </Button>
                  <Button
                    onClick={() => setShowCamera(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="incident-image-upload"
                  />
                  <Label
                    htmlFor="incident-image-upload"
                    className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-red-200 rounded-lg cursor-pointer hover:border-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">
                      Click to upload photos from device
                    </span>
                  </Label>
                </div>

                <Button
                  onClick={() => setShowCamera(true)}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photos Now
                </Button>
              </div>
            )}
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedCategory || !severity || !description.trim() || submitting}
            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg"
          >
            {submitting ? (
              'Submitting Report...'
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Incident Report with {images.length} Photo{images.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>

          {/* Report Disclaimer */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-xs text-blue-700">
              By submitting this report, you confirm that the information provided is accurate and true to the best of your knowledge. False reports may result in account suspension.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReportIncident;
