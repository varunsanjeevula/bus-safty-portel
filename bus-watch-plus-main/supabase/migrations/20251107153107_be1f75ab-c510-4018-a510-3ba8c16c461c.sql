-- Create buses table
CREATE TABLE public.buses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  route_number TEXT,
  driver_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'stopped', 'maintenance')),
  current_speed INTEGER DEFAULT 0,
  qr_code_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create route_stops table
CREATE TABLE public.route_stops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id TEXT NOT NULL REFERENCES public.buses(bus_id) ON DELETE CASCADE,
  stop_name TEXT NOT NULL,
  stop_order INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create safety_records table
CREATE TABLE public.safety_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id TEXT NOT NULL REFERENCES public.buses(bus_id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('inspection', 'accident', 'review')),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create incidents table
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id TEXT NOT NULL REFERENCES public.buses(bus_id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id TEXT NOT NULL REFERENCES public.buses(bus_id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view bus info)
CREATE POLICY "Anyone can view buses"
  ON public.buses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view route stops"
  ON public.route_stops FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view safety records"
  ON public.safety_records FOR SELECT
  USING (true);

-- Authenticated users can submit incidents and feedback
CREATE POLICY "Authenticated users can submit incidents"
  ON public.incidents FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view incidents"
  ON public.incidents FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can submit feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view feedback"
  ON public.feedback FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_route_stops_bus_id ON public.route_stops(bus_id);
CREATE INDEX idx_route_stops_order ON public.route_stops(bus_id, stop_order);
CREATE INDEX idx_safety_records_bus_id ON public.safety_records(bus_id);
CREATE INDEX idx_incidents_bus_id ON public.incidents(bus_id);
CREATE INDEX idx_feedback_bus_id ON public.feedback(bus_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_buses_updated_at
  BEFORE UPDATE ON public.buses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();