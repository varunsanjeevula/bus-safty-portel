import { supabase } from '@/integrations/supabase/client';

export interface BusStatus {
  busId: string;
  speed: number;
  lastUpdate: string;
  driverName: string;
  routeNumber: string;
  status: 'active' | 'stopped' | 'maintenance';
  title?: string;
}

export interface RouteStop {
  id: string;
  stopName: string;
  stopOrder: number;
  durationMinutes: number;
  description?: string;
}

export interface SafetyRecord {
  id: string;
  type: 'inspection' | 'accident' | 'review';
  date: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  rating?: number;
}

export interface Incident {
  category: string;
  description: string;
  image?: File;
}

export interface Feedback {
  category: string;
  description?: string;
  image?: File;
}

// API functions using Supabase
export const getBusStatus = async (busId: string): Promise<BusStatus> => {
  const { data, error } = await supabase
    .from('buses')
    .select('*')
    .eq('bus_id', busId)
    .single();

  if (error || !data) {
    throw new Error('Bus not found');
  }

  return {
    busId: data.bus_id,
    speed: data.current_speed || 0,
    lastUpdate: data.updated_at,
    driverName: data.driver_name || 'Unknown',
    routeNumber: data.route_number || 'Unknown',
    status: data.status as 'active' | 'stopped' | 'maintenance',
    title: data.title,
  };
};

export const getRouteStops = async (busId: string): Promise<RouteStop[]> => {
  const { data, error } = await supabase
    .from('route_stops')
    .select('*')
    .eq('bus_id', busId)
    .order('stop_order', { ascending: true });

  if (error) {
    throw new Error('Failed to fetch route stops');
  }

  return (data || []).map(stop => ({
    id: stop.id,
    stopName: stop.stop_name,
    stopOrder: stop.stop_order,
    durationMinutes: stop.duration_minutes,
    description: stop.description,
  }));
};

export const getBusHistory = async (busId: string): Promise<SafetyRecord[]> => {
  const { data, error } = await supabase
    .from('safety_records')
    .select('*')
    .eq('bus_id', busId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Failed to fetch safety records:', error);
    return [];
  }

  return (data || []).map(record => ({
    id: record.id,
    type: record.type as 'inspection' | 'accident' | 'review',
    date: record.date,
    description: record.description,
    severity: record.severity as 'low' | 'medium' | 'high' | undefined,
    rating: record.rating || undefined,
  }));
};

export const submitIncident = async (busId: string, incident: Incident): Promise<void> => {
  const { error } = await supabase
    .from('incidents')
    .insert({
      bus_id: busId,
      category: incident.category,
      description: incident.description,
      image_url: incident.image ? 'uploaded' : null,
    });

  if (error) {
    throw new Error('Failed to submit incident');
  }
};

export const submitFeedback = async (busId: string, feedback: Feedback): Promise<void> => {
  const { error } = await supabase
    .from('feedback')
    .insert({
      bus_id: busId,
      category: feedback.category,
      description: feedback.description || null,
      image_url: feedback.image ? 'uploaded' : null,
    });

  if (error) {
    throw new Error('Failed to submit feedback');
  }
};
