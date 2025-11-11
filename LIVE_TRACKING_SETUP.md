# 🚌 REAL-TIME GPS TRACKING IMPLEMENTATION GUIDE

## ✅ WHAT'S BEEN IMPLEMENTED

I've successfully added real-time GPS tracking with live maps to your Bus Watch Plus application!

### 📦 New Files Created

1. **`src/lib/mapConfig.ts`** (90 lines)
   - Google Maps API configuration
   - Bus status constants
   - Color mappings and styling
   - Socket events configuration

2. **`src/services/mapService.ts`** (200+ lines)
   - Map utility functions
   - Distance calculations (@turf/turf)
   - ETA calculations
   - Bus location helpers
   - Occupancy calculations

3. **`src/hooks/useGPSTracking.ts`** (250+ lines)
   - `useGPSTracking` hook - Real-time bus tracking
   - `useUserLocation` hook - User geolocation
   - Supabase real-time subscriptions
   - Location history fetching

4. **`src/components/BusMap.tsx`** (220 lines)
   - Reusable Google Maps component
   - Bus markers with status colors
   - Route polylines
   - Location trails
   - Stop markers
   - Professional UI with status cards

5. **`src/pages/LiveTracking.tsx`** (350+ lines)
   - Full-screen live tracking page
   - Real-time bus status updates
   - ETA and distance calculations
   - Bus details display
   - Share tracking link functionality
   - Auto-refresh with status badges

6. **`supabase/migrations/20251108000000_gps_tracking_setup.sql`** (SQL migration)
   - `bus_locations` table (GPS coordinates, speed, direction)
   - `bus_status` table (operational status)
   - `routes` table (route information)
   - `bus_operators` table (company info)
   - Indexes for performance
   - Real-time triggers
   - Helper functions (get_nearby_buses)

7. **`App.tsx`** (Updated)
   - Added `/bus/:busId/tracking` route for live tracking

### 📦 New Dependencies Installed

```json
{
  "@react-google-maps/api": "Latest version",
  "@turf/turf": "Latest version",
  "@turf/distance": "Latest version",
  "socket.io-client": "Latest version"
}
```

---

## 🔧 SETUP INSTRUCTIONS

### Step 1: Configure Google Maps API

1. **Get API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Maps JavaScript API"
   - Create API key from credentials
   - Restrict to your domain

2. **Add to .env**
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. **Add to HTML head** (in `index.html`)
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=marker,geometry,drawing"></script>
   ```

### Step 2: Setup Database

Run the migration to create tables:

```bash
# Option 1: Using Supabase CLI
supabase migration new gps_tracking_setup

# Option 2: Manually run SQL
# Copy content from supabase/migrations/20251108000000_gps_tracking_setup.sql
# Paste into Supabase SQL Editor and execute
```

### Step 3: Enable Realtime (Supabase)

1. Go to Supabase Dashboard
2. Navigate to Replication settings
3. Enable Realtime for these tables:
   - `bus_locations`
   - `bus_status`

### Step 4: Update BusDetails Component (Optional)

Add tracking button to existing BusDetails page:

```tsx
import { useNavigate } from "react-router-dom";

// In your BusDetails component, add:
const navigate = useNavigate();

// Add button to navigate to tracking:
<Button onClick={() => navigate(`/bus/${busId}/tracking`)}>
  <MapPin className="mr-2 h-4 w-4" />
  Live Tracking
</Button>
```

---

## 🗺️ FEATURES IMPLEMENTED

### For Users (Passengers)

✅ **Live Bus Tracking**
- Real-time bus location on Google Map
- Current and next stop information
- ETA (Estimated Time of Arrival)
- Distance to next stop
- Auto-updating every 5 seconds

✅ **Bus Status Information**
- Bus number and route
- Current operational status (On time / Delayed / Completed)
- Delay information
- Passenger occupancy percentage
- Bus capacity

✅ **Interactive Map**
- Bus markers (blue circles)
- Stop markers (red circles)
- User location marker (green circle)
- Route polyline (blue line)
- Bus trail/path (purple line, last 100 points)
- Click to interact with markers

✅ **Journey Planning**
- View current stop
- View next stop
- See ETA with time remaining
- Distance calculation
- Share tracking link with others

✅ **User Location**
- Display user's current location on map
- Auto-update with high accuracy
- Watch position continuously

### For Developers

✅ **Reusable Components**
- `BusMap` component - Use on any page with `busId`
- `useGPSTracking` hook - Get real-time data
- `useUserLocation` hook - Get user's location

✅ **Utility Functions**
- Calculate distance between points
- Calculate bearing/direction
- Calculate ETA
- Find nearest stops
- Find nearby buses
- Format coordinates
- Calculate route progress
- Get occupancy levels

✅ **Real-time Updates**
- Supabase real-time subscriptions
- Automatic location updates
- Status change notifications
- Efficient event handling

---

## 📱 USAGE EXAMPLES

### Example 1: Add Tracking to BusDetails Page

```tsx
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export const BusDetails = () => {
  const { busId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      {/* ... existing content ... */}
      <Button 
        onClick={() => navigate(`/bus/${busId}/tracking`)}
        className="w-full"
      >
        <MapPin className="mr-2 h-4 w-4" />
        Track This Bus
      </Button>
    </div>
  );
};
```

### Example 2: Embed Map on Home Page

```tsx
import BusMap from "@/components/BusMap";
import { useGPSTracking, useUserLocation } from "@/hooks/useGPSTracking";

export const Home = () => {
  const [selectedBusId, setSelectedBusId] = useState<string>();
  const { locations, currentStatus } = useGPSTracking({
    busId: selectedBusId,
  });
  const { location: userLocation } = useUserLocation();

  return (
    <BusMap
      center={{ lat: 28.7041, lng: 77.1025 }}
      busLocations={locations}
      busStatus={currentStatus}
      userLocation={userLocation}
      onBusClick={(busId) => setSelectedBusId(busId)}
    />
  );
};
```

### Example 3: Get Nearby Buses

```tsx
import { useGPSTracking } from "@/hooks/useGPSTracking";

export const NearbyBuses = () => {
  const { getNearbyBuses } = useGPSTracking({ enabled: false });

  const handleFindNearby = async () => {
    const buses = await getNearbyBuses(
      28.7041,  // latitude
      77.1025,  // longitude
      5         // within 5 km
    );
    console.log("Nearby buses:", buses);
  };

  return (
    <button onClick={handleFindNearby}>
      Find Nearby Buses
    </button>
  );
};
```

### Example 4: Update Bus Location (For Testing)

```tsx
import { useGPSTracking } from "@/hooks/useGPSTracking";

const { updateBusLocation } = useGPSTracking({ busId: "bus-123" });

// Simulate bus movement for testing
await updateBusLocation(28.7041, 77.1025, 25, 90);
```

---

## 🗄️ DATABASE SCHEMA

### bus_locations Table
```sql
- id (UUID, Primary Key)
- bus_id (VARCHAR, Foreign Key to buses)
- latitude (FLOAT)
- longitude (FLOAT)
- speed (FLOAT)
- direction (INT, 0-360 degrees)
- altitude (FLOAT, optional)
- accuracy (FLOAT, optional)
- timestamp (TIMESTAMP)
- created_at (TIMESTAMP)
```

### bus_status Table
```sql
- id (UUID, Primary Key)
- bus_id (VARCHAR, Foreign Key to buses, UNIQUE)
- current_stop_id (UUID)
- current_stop_name (VARCHAR)
- next_stop_id (UUID)
- next_stop_name (VARCHAR)
- passengers_count (INT)
- capacity (INT)
- delay_minutes (INT)
- status (VARCHAR: on_time, delayed, completed, not_started)
- eta (TIMESTAMP)
- current_route_id (UUID)
- last_updated (TIMESTAMP)
```

### routes Table
```sql
- id (UUID, Primary Key)
- operator_id (UUID)
- route_number (VARCHAR)
- route_name (VARCHAR)
- description (TEXT)
- total_distance (FLOAT, in km)
- estimated_duration (INT, in minutes)
- polyline (JSONB, encoded route)
- is_active (BOOLEAN)
```

---

## 🎨 CUSTOMIZATION

### Change Default Map Center

Edit `src/lib/mapConfig.ts`:
```typescript
defaultCenter: {
  lat: 28.7041,    // Change to your city
  lng: 77.1025,    // Change to your city
},
```

### Change Tracking Update Interval

Edit `src/lib/mapConfig.ts`:
```typescript
trackingConfig: {
  updateInterval: 5000,  // Change to desired milliseconds
}
```

### Change Map Colors

Edit `src/lib/mapConfig.ts`:
```typescript
STATUS_COLORS = {
  on_time: "#10b981",    // Green
  delayed: "#f97316",    // Orange
  completed: "#8b5cf6",  // Purple
  not_started: "#6b7280" // Gray
}
```

### Change Bus Marker Style

Edit `src/components/BusMap.tsx`:
```tsx
icon: {
  path: google.maps.SymbolPath.CIRCLE,
  scale: 8,
  fillColor: "#3b82f6",
  fillOpacity: 0.8,
}
```

---

## 🧪 TESTING THE FEATURE

### 1. Test Without Real Buses

```tsx
// In LiveTracking page, add mock data:
const mockLocation = {
  busId: "BUS-101",
  latitude: 28.7041,
  longitude: 77.1025,
  speed: 30,
  direction: 90,
  timestamp: new Date(),
};

// Use for testing without database
<BusMap busLocations={[mockLocation]} />
```

### 2. Add Test Bus Data

```sql
-- Insert test bus
INSERT INTO buses (id, number, route_name, capacity)
VALUES ('test-bus-1', '101', 'Route 101', 50);

-- Insert test location
INSERT INTO bus_locations (bus_id, latitude, longitude, speed, direction)
VALUES ('test-bus-1', 28.7041, 77.1025, 25, 90);

-- Insert test status
INSERT INTO bus_status (bus_id, passengers_count, capacity, status)
VALUES ('test-bus-1', 30, 50, 'on_time');
```

### 3. Test Real-time Updates

Open the app in two windows:
1. First window: Open `localhost:5173/bus/test-bus-1/tracking`
2. Second window: Run SQL update to change location
3. See location update in real-time in first window

---

## 📊 PERFORMANCE TIPS

✅ **Already Optimized**
- Database indexes on bus_id and timestamp
- Supabase real-time subscriptions (efficient)
- Limited location history (100 points max)
- Cleanup function for old data (>30 days)

✅ **Further Optimization**

1. **Add Caching**
   ```tsx
   // Cache locations for 10 seconds
   const cachedLocations = useMemo(() => locations, [locations]);
   ```

2. **Limit Map Markers**
   ```tsx
   // Only show nearby buses
   const visibleBuses = locations.filter(loc => {
     const distance = calculateDistance(center, loc);
     return distance < 10; // 10 km
   });
   ```

3. **Batch Updates**
   - Update bus status every 30 seconds instead of 5

---

## 🚀 NEXT STEPS

### Phase 2 Features to Add

1. **Notifications** (Priority 1)
   - Push notification when bus arrives
   - Delay alerts
   - Route change notifications

2. **Route Planning** (Priority 2)
   - Select start and end points
   - Show all available routes
   - Calculate journey time

3. **Booking System** (Priority 3)
   - Book seats in advance
   - Digital tickets with QR codes
   - Payment integration

4. **Admin Dashboard** (Priority 4)
   - Monitor all buses
   - Real-time analytics
   - Driver management

---

## 🐛 TROUBLESHOOTING

### Map not showing?
```
✓ Check VITE_GOOGLE_MAPS_API_KEY in .env
✓ Check Google Maps script in index.html
✓ Check browser console for errors
✓ Verify API key has correct permissions
```

### Real-time updates not working?
```
✓ Check Supabase is configured correctly
✓ Verify real-time is enabled for tables
✓ Check database queries with `supabase sql`
✓ Check network tab for WebSocket connection
```

### Geolocation not working?
```
✓ Check browser allows location access
✓ Verify useUserLocation is enabled={true}
✓ Check console for geolocation errors
✓ Note: HTTPS required for production
```

---

## 📚 USEFUL LINKS

- [Google Maps API Documentation](https://developers.google.com/maps/documentation)
- [React Google Maps API](https://react-google-maps-api-docs.netlify.app/)
- [Turf.js Documentation](https://turfjs.org/)
- [Supabase Real-time](https://supabase.com/docs/guides/realtime)
- [Supabase Functions](https://supabase.com/docs/guides/functions)

---

## 📞 SUPPORT

### Common Questions

**Q: How do I add my own bus data?**
A: Insert into `buses`, `bus_locations`, and `bus_status` tables

**Q: Can I use a different map provider?**
A: Yes, replace with Mapbox, Leaflet, or OpenStreetMap

**Q: How do buses update their location?**
A: Via GPS devices on the bus sending data to `bus_locations` table

**Q: Do I need a real bus with GPS?**
A: For testing, you can insert mock data directly into the database

---

## ✨ KEY FEATURES AT A GLANCE

| Feature | Status | Component |
|---------|--------|-----------|
| Live Bus Tracking | ✅ Done | BusMap.tsx |
| Real-time Updates | ✅ Done | useGPSTracking.ts |
| ETA Calculation | ✅ Done | mapService.ts |
| Occupancy Display | ✅ Done | BusMap.tsx |
| User Location | ✅ Done | useUserLocation() |
| Nearby Buses | ✅ Done | mapService.ts |
| Route Visualization | ✅ Done | BusMap.tsx |
| Location Trail | ✅ Done | BusMap.tsx |
| Distance Calculation | ✅ Done | mapService.ts |
| Share Tracking | ✅ Done | LiveTracking.tsx |

---

## 🎉 YOU'RE ALL SET!

Your Bus Watch Plus app now has professional-grade **real-time GPS tracking** with live maps!

### Start Using:
1. Set up Google Maps API key
2. Run database migrations
3. Navigate to `/bus/{busId}/tracking`
4. Watch buses move in real-time!

---

**Happy Tracking! 🚌📍**
