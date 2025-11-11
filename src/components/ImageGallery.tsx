import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Download, Eye } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title?: string;
  maxPreviewHeight?: number;
}

export const ImageGallery = ({
  images,
  title = 'Photos',
  maxPreviewHeight = 40,
}: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `photo-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          {title} ({images.length})
        </h4>
        
        {/* Thumbnail Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className={`w-full h-${maxPreviewHeight} object-cover transition-transform group-hover:scale-105`}
                onClick={() => setSelectedIndex(index)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(index);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image, index);
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <span className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className={`fixed inset-0 z-50 transition-all ${
            isFullscreen
              ? 'bg-black'
              : 'bg-black/50 backdrop-blur-sm'
          }`}
          onClick={() => {
            setSelectedIndex(null);
            setIsFullscreen(false);
          }}
        >
          {/* Modal Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative flex-1 flex items-center justify-center w-full">
                <img
                  src={images[selectedIndex]}
                  alt={`${title} ${selectedIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-black/50 text-white hover:bg-black/70 rounded-full"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? '↙' : '⛶'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-black/50 text-white hover:bg-black/70 rounded-full"
                  onClick={() => handleDownload(images[selectedIndex], selectedIndex)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-black/50 text-white hover:bg-black/70 rounded-full"
                  onClick={() => {
                    setSelectedIndex(null);
                    setIsFullscreen(false);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full"
                    onClick={handleNext}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
                {selectedIndex + 1} / {images.length}
              </div>

              {/* Keyboard Navigation Hint */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 text-white text-xs bg-black/50 px-3 py-2 rounded">
                  ← → to navigate | ESC to close
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Navigation */}
      {selectedIndex !== null && (
        <div
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') {
              setSelectedIndex(null);
              setIsFullscreen(false);
            }
          }}
          style={{ position: 'fixed', width: '100%', height: '100%' }}
          tabIndex={0}
          autoFocus
        />
      )}
    </>
  );
};
