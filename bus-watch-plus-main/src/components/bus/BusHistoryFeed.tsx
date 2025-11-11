import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  MessageSquare, 
  RefreshCw, 
  Image,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Feedback {
  id: string;
  bus_id: string;
  category: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

interface Incident {
  id: string;
  bus_id: string;
  category: string;
  description: string;
  image_url?: string;
  created_at: string;
}

type HistoryItem = (Feedback | Incident) & { type: 'feedback' | 'incident' };

export const BusHistoryFeed = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'feedback' | 'incident'>('all');

  const fetchHistory = async () => {
    try {
      setLoading(true);

      // Fetch feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (feedbackError) throw feedbackError;

      // Fetch incidents
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (incidentsError) throw incidentsError;

      // Combine and sort by date
      const combined: HistoryItem[] = [
        ...(feedbackData?.map(item => ({ ...item, type: 'feedback' as const })) || []),
        ...(incidentsData?.map(item => ({ ...item, type: 'incident' as const })) || []),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setHistoryItems(combined);

      if (combined.length === 0) {
        console.log('No history items found');
      } else {
        console.log(`Loaded ${combined.length} history items:`, combined);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Failed to load bus history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredItems = historyItems.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getCategoryColor = (type: 'feedback' | 'incident', category?: string) => {
    if (type === 'incident') {
      return 'bg-red-50 text-red-700 border-red-200';
    }
    
    switch (category?.toLowerCase()) {
      case 'cleanliness':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'safety':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'comfort':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'service':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'driver':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: 'feedback' | 'incident') => {
    return type === 'incident' ? (
      <AlertCircle className="w-5 h-5 text-red-600" />
    ) : (
      <MessageSquare className="w-5 h-5 text-blue-600" />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Bus History</h3>
          <p className="text-sm text-gray-600 mt-1">
            All reports and feedback from across all buses
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => fetchHistory()}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'feedback', 'incident'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filter === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab === 'all' ? 'All' : tab === 'feedback' ? 'Feedback' : 'Incidents'}
            <Badge 
              variant={filter === tab ? 'secondary' : 'outline'} 
              className="ml-2 text-xs"
            >
              {historyItems.filter(item => tab === 'all' || item.type === tab).length}
            </Badge>
          </button>
        ))}
      </div>

      {/* History Items */}
      {filteredItems.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No {filter === 'all' ? 'history' : filter} records yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Reports and feedback will appear here
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`p-4 cursor-pointer hover:shadow-md transition-all border-l-4 ${
                item.type === 'incident'
                  ? 'border-l-red-500 hover:border-red-600'
                  : 'border-l-blue-500 hover:border-blue-600'
              }`}
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'incident'
                        ? 'bg-red-50'
                        : 'bg-blue-50'
                    }`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge 
                          variant="outline"
                          className={`text-xs capitalize ${getCategoryColor(item.type, item.category)}`}
                        >
                          {item.category}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs"
                        >
                          {item.type === 'incident' ? 'Report' : 'Feedback'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Bus: {item.bus_id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.created_at)}
                    </span>
                    {expandedId === item.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === item.id && (
                  <div className="space-y-3 pt-3 border-t border-gray-200">
                    {(item.description || 'description' in item) && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Description</p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {item.description || 'No description provided'}
                        </p>
                      </div>
                    )}

                    {item.image_url && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                          <Image className="w-3 h-3" />
                          Attached Image
                        </p>
                        <img
                          src={item.image_url}
                          alt="Attachment"
                          className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <span>ID: {item.id.slice(0, 8)}...</span>
                      <span>{new Date(item.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Info */}
      {filteredItems.length > 0 && (
        <p className="text-xs text-gray-500 text-center py-2">
          Showing {filteredItems.length} {filter === 'all' ? 'item' : filter}
          {filteredItems.length > 1 ? 's' : ''} (Limited to recent 100)
        </p>
      )}
    </div>
  );
};

export default BusHistoryFeed;
