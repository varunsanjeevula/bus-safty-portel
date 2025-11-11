import { useState, useRef, useEffect } from 'react';
import { submitFeedback } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Upload, Send, CheckCircle, Camera, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SubmitFeedbackProps {
  busId: string;
}

const categories = [
  'Driver Behavior',
  'Cleanliness',
  'Safety Equipment',
  'Comfort',
  'Timeliness',
  'Other',
];

const SubmitFeedback = ({ busId }: SubmitFeedbackProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [rating, setRating] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
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
    if (images.length >= 5) {
      toast.error('Maximum 5 images allowed');
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
      toast.error('Please select a feedback category');
      return;
    }

    if (rating === 0) {
      toast.error('Please rate the driver');
      return;
    }

    try {
      setSubmitting(true);

      // Upload images to Supabase storage
      const uploadedImageUrls: string[] = [];
      for (const image of images) {
        const fileName = `feedback-${busId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
        const { error } = await supabase.storage
          .from('feedback-images')
          .upload(fileName, image);

        if (!error) {
          const { data } = supabase.storage
            .from('feedback-images')
            .getPublicUrl(fileName);
          uploadedImageUrls.push(data.publicUrl);
        }
      }

      // Submit feedback to database
      await supabase
        .from('feedback')
        .insert({
          bus_id: busId,
          category: selectedCategory,
          description: description || null,
          image_url: uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : null,
          image_urls: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
        });

      toast.success('Feedback submitted successfully!');
      setSubmitted(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setSelectedCategory('');
        setDescription('');
        setImages([]);
        setPreviewUrls([]);
        setRating(0);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit feedback');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="p-12 text-center bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600">
          Your feedback has been submitted successfully. Driver rating updated.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Select Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-indigo-50'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Driver Rating */}
      <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
        <Label className="text-base font-semibold mb-4 block text-gray-900">
          Rate the Driver
        </Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {rating > 0 ? `Rating: ${rating} / 5 stars` : 'Select a rating'}
        </p>
      </Card>

      {/* Description */}
      <Card className="p-6 border-0 shadow-lg">
        <Label htmlFor="description" className="text-base font-semibold mb-3 block text-gray-900">
          Your Feedback (Optional)
        </Label>
        <Textarea
          id="description"
          placeholder="Tell us more about your experience..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-32 resize-none"
        />
      </Card>

      {/* Image Preview */}
      {previewUrls.length > 0 && (
        <Card className="p-6 border-0 shadow-lg">
          <Label className="text-base font-semibold mb-3 block text-gray-900">
            Attached Photos ({previewUrls.length}/5)
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
          Add Photos
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
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
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
                id="image-upload"
              />
              <Label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-indigo-200 rounded-lg cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Upload className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-indigo-600 font-medium">
                  Click to upload photos from device
                </span>
              </Label>
            </div>

            <Button
              onClick={() => setShowCamera(true)}
              variant="outline"
              className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo Now
            </Button>
          </div>
        )}
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!selectedCategory || rating === 0 || submitting}
        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        {submitting ? (
          'Submitting...'
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Submit Feedback with {images.length} Photo{images.length !== 1 ? 's' : ''}
          </>
        )}
      </Button>
    </div>
  );
};

export default SubmitFeedback;
