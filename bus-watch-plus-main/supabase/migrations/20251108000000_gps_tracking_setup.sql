-- Bus Locations Table - Stores GPS coordinates and movement data
CREATE TABLE IF NOT EXISTS bus_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id VARCHAR NOT NULL REFERENCES buses(id),
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  speed FLOAT DEFAULT 0,
  direction INT DEFAULT 0,
  altitude FLOAT,
  accuracy FLOAT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_bus_locations_bus_id ON bus_locations(bus_id);
CREATE INDEX idx_bus_locations_timestamp ON bus_locations(timestamp DESC);
CREATE INDEX idx_bus_locations_created_at ON bus_locations(created_at DESC);

-- Real-time subscription for bus locations
ALTER TABLE bus_locations REPLICA IDENTITY FULL;

-- ============================================================

-- Bus Status Table - Current operational status of each bus
CREATE TABLE IF NOT EXISTS bus_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id VARCHAR NOT NULL UNIQUE REFERENCES buses(id),
  current_stop_id UUID REFERENCES route_stops(id),
  current_stop_name VARCHAR,
  current_stop_lat FLOAT,
  current_stop_lng FLOAT,
  next_stop_id UUID,
  next_stop_name VARCHAR,
  next_stop_lat FLOAT,
  next_stop_lng FLOAT,
  passengers_count INT DEFAULT 0,
  capacity INT DEFAULT 50,
  delay_minutes INT DEFAULT 0,
  status VARCHAR DEFAULT 'on_time' CHECK (status IN ('on_time', 'delayed', 'completed', 'not_started')),
  eta TIMESTAMP,
  current_route_id UUID REFERENCES routes(id),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bus_status_bus_id ON bus_status(bus_id);
CREATE INDEX idx_bus_status_status ON bus_status(status);
ALTER TABLE bus_status REPLICA IDENTITY FULL;

-- ============================================================

-- Routes Table - Bus routes information
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES bus_operators(id),
  route_number VARCHAR NOT NULL,
  route_name VARCHAR NOT NULL,
  description TEXT,
  start_stop_id UUID REFERENCES route_stops(id),
  end_stop_id UUID REFERENCES route_stops(id),
  total_distance FLOAT,
  estimated_duration INT,
  polyline JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_routes_operator_id ON routes(operator_id);
CREATE INDEX idx_routes_active ON routes(is_active);

-- ============================================================

-- Bus Operators Table - Bus company information
CREATE TABLE IF NOT EXISTS bus_operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  registration_number VARCHAR UNIQUE,
  email VARCHAR,
  phone VARCHAR,
  address TEXT,
  city VARCHAR,
  state VARCHAR,
  total_buses INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bus_operators_city ON bus_operators(city);

-- ============================================================

-- Update buses table with additional fields (if not exists)
ALTER TABLE buses ADD COLUMN IF NOT EXISTS operator_id UUID REFERENCES bus_operators(id);
ALTER TABLE buses ADD COLUMN IF NOT EXISTS current_route_id UUID REFERENCES routes(id);
ALTER TABLE buses ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMP;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_buses_operator_id ON buses(operator_id);
CREATE INDEX IF NOT EXISTS idx_buses_is_active ON buses(is_active);

-- ============================================================

-- Route Stops Table (if not exists)
CREATE TABLE IF NOT EXISTS route_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id),
  stop_name VARCHAR NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  area VARCHAR,
  stop_order INT,
  arrival_time_offset INT,
  is_primary_stop BOOLEAN DEFAULT FALSE,
  accessibility_info JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_route_stops_route_id ON route_stops(route_id);
CREATE INDEX idx_route_stops_location ON route_stops USING gist(ll_to_earth(latitude, longitude));

-- ============================================================

-- Function to get nearby buses (helper function)
CREATE OR REPLACE FUNCTION get_nearby_buses(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_km FLOAT DEFAULT 5
)
RETURNS TABLE (
  bus_id VARCHAR,
  bus_number VARCHAR,
  latitude FLOAT,
  longitude FLOAT,
  route_name VARCHAR,
  delay_minutes INT,
  status VARCHAR,
  distance_km FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    bl.bus_id,
    b.number,
    bl.latitude,
    bl.longitude,
    r.route_name,
    bs.delay_minutes,
    bs.status,
    earth_distance(
      ll_to_earth(user_lat, user_lng),
      ll_to_earth(bl.latitude, bl.longitude)
    ) / 1000 as distance_km
  FROM bus_locations bl
  JOIN buses b ON bl.bus_id = b.id
  LEFT JOIN bus_status bs ON bl.bus_id = bs.bus_id
  LEFT JOIN routes r ON bs.current_route_id = r.id
  WHERE earth_distance(
    ll_to_earth(user_lat, user_lng),
    ll_to_earth(bl.latitude, bl.longitude)
  ) <= radius_km * 1000
  AND bl.timestamp > CURRENT_TIMESTAMP - INTERVAL '5 minutes'
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================

-- Enable PostGIS for location queries (if available)
CREATE EXTENSION IF NOT EXISTS earthdistance CASCADE;
CREATE EXTENSION IF NOT EXISTS cube;

-- ============================================================

-- Triggers for automated updates

-- Update bus_locations last_updated timestamp
CREATE OR REPLACE FUNCTION update_bus_last_location()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE buses
  SET last_location_update = NEW.timestamp
  WHERE id = NEW.bus_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_bus_last_location ON bus_locations;
CREATE TRIGGER trg_update_bus_last_location
AFTER INSERT ON bus_locations
FOR EACH ROW
EXECUTE FUNCTION update_bus_last_location();

-- Update bus_status last_updated
CREATE OR REPLACE FUNCTION update_bus_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_bus_status_timestamp ON bus_status;
CREATE TRIGGER trg_update_bus_status_timestamp
BEFORE UPDATE ON bus_status
FOR EACH ROW
EXECUTE FUNCTION update_bus_status_timestamp();

-- ============================================================

-- Cleanup function to remove old location data (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_locations()
RETURNS void AS $$
BEGIN
  DELETE FROM bus_locations
  WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================================

-- Sample data for testing (optional)
-- This will help you test the tracking system
INSERT INTO bus_operators (name, registration_number, email, phone, city, is_verified)
VALUES 
  ('City Bus Transport', 'RJ-2025-001', 'contact@citybus.com', '9876543210', 'Delhi', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO routes (route_number, route_name, description, operator_id, total_distance)
SELECT '101', 'Delhi Central - Airport', 'City airport shuttle service', id, 25.5
FROM bus_operators WHERE name = 'City Bus Transport'
ON CONFLICT DO NOTHING;

-- ============================================================
-- Run this migration using supabase CLI:
-- supabase migration new gps_tracking_setup
-- Then paste this content into the generated migration file
-- supabase db push
