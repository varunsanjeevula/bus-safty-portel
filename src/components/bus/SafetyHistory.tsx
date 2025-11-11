import { useEffect, useState } from 'react';
import { getBusHistory, type SafetyRecord } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardCheck, AlertTriangle, Star, Calendar, MessageSquare, RefreshCw, Image, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface SafetyHistoryProps {
  busId: string;
}

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

type HistoryItem = SafetyRecord & { type: 'safety' };
type FeedbackItem = Feedback & { type: 'feedback' };
type IncidentItem = Incident & { type: 'incident' };
type CombinedItem = HistoryItem | FeedbackItem | IncidentItem;

const SafetyHistory = ({ busId }: SafetyHistoryProps) => {
  const [history, setHistory] = useState<SafetyRecord[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      
      // Fetch safety records
      const safetyData = await getBusHistory(busId);
      setHistory(safetyData);

      // Fetch feedback for this bus
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('bus_id', busId)
        .order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;
      setFeedback(feedbackData || []);

      // Fetch incidents for this bus
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('incidents')
        .select('*')
        .eq('bus_id', busId)
        .order('created_at', { ascending: false });

      if (incidentsError) throw incidentsError;
      setIncidents(incidentsData || []);

      console.log(`Loaded history for bus ${busId}:`, {
        safety: safetyData.length,
        feedback: feedbackData?.length || 0,
        incidents: incidentsData?.length || 0,
      });
    } catch (error) {
      toast.error('Failed to load history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHistory();
  }, [busId]);

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'inspection':
        return <ClipboardCheck className="w-5 h-5" />;
      case 'accident':
        return <AlertTriangle className="w-5 h-5" />;
      case 'review':
        return <Star className="w-5 h-5" />;
      case 'feedback':
        return <MessageSquare className="w-5 h-5" />;
      case 'incident':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getRecordColor = (type: string, severity?: string) => {
    if (type === 'incident') return 'destructive';
    if (type === 'feedback') return 'default';
    if (type === 'accident') return 'destructive';
    if (type === 'review') return 'default';
    if (severity === 'low') return 'secondary';
    if (severity === 'medium') return 'default';
    if (severity === 'high') return 'destructive';
    return 'secondary';
  };

  const getRecordBg = (type: string) => {
    switch (type) {
      case 'inspection':
        return 'bg-success/10';
      case 'accident':
        return 'bg-destructive/10';
      case 'review':
        return 'bg-accent/10';
      case 'feedback':
        return 'bg-blue-50';
      case 'incident':
        return 'bg-red-50';
      default:
        return 'bg-muted';
    }
  };

  const getCategoryColor = (category?: string) => {
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
      <div className="space-y-3">
        <Skeleton className="h-8 w-32" />
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-20" />
          </Card>
        ))}
      </div>
    );
  }

  const totalRecords = history.length + feedback.length + incidents.length;

  if (totalRecords === 0) {
    return (
      <Card className="p-8 text-center">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">No history records available</p>
        <p className="text-xs text-muted-foreground mt-1">Safety checks, feedback, and reports will appear here</p>
      </Card>
    );
  }

  // Combine all records and sort by date
  const allRecords: Array<{
    id: string;
    date: string;
    type: 'safety' | 'feedback' | 'incident';
    record: SafetyRecord | Feedback | Incident;
  }> = [
    ...history.map(r => ({
      id: r.id,
      date: r.date,
      type: 'safety' as const,
      record: r,
    })),
    ...feedback.map(f => ({
      id: f.id,
      date: f.created_at,
      type: 'feedback' as const,
      record: f,
    })),
    ...incidents.map(i => ({
      id: i.id,
      date: i.created_at,
      type: 'incident' as const,
      record: i,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Bus History</h3>
          <p className="text-xs text-muted-foreground mt-1">Safety records, feedback, and reports</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {history.length} safety
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {feedback.length} feedback
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {incidents.length} reports
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchAllHistory()}
            className="gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {allRecords.map(({ id, type, record }) => (
          <Card
            key={id}
            className={`p-4 cursor-pointer hover:shadow-md transition-all border-l-4 ${
              type === 'incident'
                ? 'border-l-red-500 hover:border-red-600'
                : type === 'feedback'
                ? 'border-l-blue-500 hover:border-blue-600'
                : 'border-l-green-500 hover:border-green-600'
            }`}
            onClick={() => setExpandedId(expandedId === id ? null : id)}
          >
            <div className="space-y-2">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${getRecordBg(type)}`}>
                    {getRecordIcon(type)}
                  </div>
                  <div className="flex-1">
                    {type === 'safety' && (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={getRecordColor((record as SafetyRecord).type, (record as SafetyRecord).severity)}
                            className="text-xs capitalize"
                          >
                            {(record as SafetyRecord).type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">Safety</Badge>
                        </div>
                        <p className="text-sm text-foreground font-medium">
                          {(record as SafetyRecord).description}
                        </p>
                      </>
                    )}
                    {type === 'feedback' && (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${getCategoryColor((record as Feedback).category)}`}
                          >
                            {(record as Feedback).category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">Feedback</Badge>
                        </div>
                        <p className="text-sm text-foreground font-medium">
                          {(record as Feedback).description || 'No description provided'}
                        </p>
                      </>
                    )}
                    {type === 'incident' && (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${getCategoryColor((record as Incident).category)}`}
                          >
                            {(record as Incident).category}
                          </Badge>
                          <Badge variant="destructive" className="text-xs">Report</Badge>
                        </div>
                        <p className="text-sm text-foreground font-medium">
                          {(record as Incident).description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">
                    {type === 'safety' 
                      ? formatDate((record as SafetyRecord).date)
                      : type === 'feedback'
                      ? formatDate((record as Feedback).created_at)
                      : formatDate((record as Incident).created_at)
                    }
                  </span>
                  {expandedId === id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === id && (
                <div className="space-y-2 pt-2 border-t border-border">
                  {type === 'safety' && (record as SafetyRecord).severity && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Severity:</span>
                      <Badge
                        variant={(record as SafetyRecord).severity === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs capitalize"
                      >
                        {(record as SafetyRecord).severity}
                      </Badge>
                    </div>
                  )}
                  
                  {type === 'safety' && (record as SafetyRecord).rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < (record as SafetyRecord).rating!
                              ? 'fill-warning text-warning'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {(type === 'feedback' || type === 'incident') && (record as any).image_url && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                        <Image className="w-3 h-3" />
                        Attached Image
                      </p>
                      <img
                        src={(record as any).image_url}
                        alt="Attachment"
                        className="w-full max-h-48 object-cover rounded-lg border border-border"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                    <span>ID: {id.slice(0, 8)}...</span>
                    <span>{new Date(
                      type === 'safety' 
                        ? (record as SafetyRecord).date
                        : type === 'feedback'
                        ? (record as Feedback).created_at
                        : (record as Incident).created_at
                    ).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SafetyHistory;
