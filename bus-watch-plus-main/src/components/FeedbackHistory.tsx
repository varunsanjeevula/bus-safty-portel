import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, MessageSquare, Trash2, Image, RefreshCw } from 'lucide-react';
import { ImageGallery } from '@/components/ImageGallery';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Feedback {
  id: string;
  bus_id: string;
  category: string;
  description: string | null;
  image_url: string | null;
  image_urls?: string[] | null;
  created_at: string;
}

export const FeedbackHistory = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      console.log('Fetching feedback...');
      
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Feedback fetched:', data);
      setFeedback((data as Feedback[]) || []);
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feedback? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFeedback(feedback.filter((f) => f.id !== id));
      toast.success('Feedback deleted');
    } catch (error) {
      toast.error('Failed to delete feedback');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Driver Behavior': 'bg-blue-100 text-blue-700 border-blue-300',
      'Cleanliness': 'bg-green-100 text-green-700 border-green-300',
      'Safety Equipment': 'bg-purple-100 text-purple-700 border-purple-300',
      'Comfort': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Timeliness': 'bg-orange-100 text-orange-700 border-orange-300',
      'Other': 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Loading Feedback...</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchFeedback()}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end mb-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchFeedback()}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
        <Card className="p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Yet</h3>
          <p className="text-gray-600 mb-6">
            Start sharing your bus experience by providing feedback on your rides.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge className={`${getCategoryColor(item.category)} border`}>
                    {item.category}
                  </Badge>
                  {((item.image_urls && item.image_urls.length > 0) || item.image_url) && (
                    <span className="text-xs text-blue-600 flex items-center gap-1">
                      <Image className="w-3 h-3" />
                      {(item.image_urls?.length || (item.image_url ? 1 : 0))} Photo{
                        ((item.image_urls?.length || (item.image_url ? 1 : 0)) !== 1) ? 's' : ''
                      }
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{formatDate(item.created_at)}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item.id)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description || 'No description provided'}
              </p>
            </div>

            {/* Expandable Section */}
            {expandedId === item.id && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {/* Full Description */}
                {item.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Full Feedback
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Photos Gallery */}
                {(item.image_urls && item.image_urls.length > 0) || item.image_url ? (
                  <div>
                    <ImageGallery
                      images={
                        (item.image_urls && item.image_urls.length > 0)
                          ? item.image_urls
                          : (item.image_url ? [item.image_url] : [])
                      }
                      title="Attached Photos"
                      maxPreviewHeight={40}
                    />
                  </div>
                ) : null}

                {/* Bus Info */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Bus ID:</span> {item.bus_id}
                  </p>
                </div>
              </div>
            )}

            {/* Expand Button */}
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                {expandedId === item.id ? 'Hide' : 'Show'} Details
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    expandedId === item.id ? 'rotate-90' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
