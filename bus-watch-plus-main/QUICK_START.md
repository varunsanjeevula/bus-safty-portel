# ⚡ QUICK START GUIDE - REAL-TIME GPS TRACKING

## 🚀 Get Running in 5 Minutes

### Step 1: Get Google Maps API Key (1 min)
```bash
1. Visit https://console.cloud.google.com/
2. Create a new project (name anything)
3. Search "Maps JavaScript API"
4. Click Enable
5. Go to Credentials → Create Credentials → API Key
6. Copy the key
```

### Step 2: Add to .env (30 seconds)
```bash
# In your project root, create/edit .env file:
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD_xxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Update index.html (30 seconds)
```html
<!-- In <head> section of index.html, add: -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=marker,geometry,drawing"></script>
```

### Step 4: Run Database Migration (1 min)
```bash
# Option A: Using Supabase CLI
supabase migration new gps_tracking_setup
# Copy content from supabase/migrations/20251108000000_gps_tracking_setup.sql
# Paste into new file and save

# Option B: Manual SQL in Supabase Dashboard
# Open Supabase → SQL Editor
# Copy all content from supabase/migrations/20251108000000_gps_tracking_setup.sql
# Paste and run
```

### Step 5: Enable Real-time (1 min)
```bash
In Supabase Dashboard:
1. Go to Replication settings
2. Find bus_locations table → Enable
3. Find bus_status table → Enable
```

### Step 6: Test It! (30 seconds)
```bash
# Start your app
npm run dev

# Visit in browser
http://localhost:5173/bus/test-123/tracking

# You should see a map!
```

---

## 📍 TEST DATA (Optional)

Insert test data to see real-time updates:

```sql
-- 1. Create a test bus
INSERT INTO buses (id, number, route_name, capacity)
VALUES ('test-bus-001', '101', 'Route 101', 50);

-- 2. Add initial location
INSERT INTO bus_locations (bus_id, latitude, longitude, speed, direction)
VALUES ('test-bus-001', 28.7041, 77.1025, 25, 90);

-- 3. Create bus status
INSERT INTO bus_status (bus_id, passengers_count, capacity, status)
VALUES ('test-bus-001', 30, 50, 'on_time');
```

Then visit: `http://localhost:5173/bus/test-bus-001/tracking`

---

## 🗺️ UPDATE BUS LOCATION (For Testing)

Simulate bus movement:

```sql
-- Update location to move bus
UPDATE bus_locations
SET latitude = 28.7050, longitude = 77.1035, speed = 30
WHERE bus_id = 'test-bus-001';

-- Update status
UPDATE bus_status
SET delay_minutes = 0, passengers_count = 35
WHERE bus_id = 'test-bus-001';
```

Watch the map update in real-time!

---

## ✅ QUICK CHECKLIST

- [ ] Google Maps API key obtained
- [ ] `.env` file updated
- [ ] `index.html` script tag added
- [ ] Database migrations run
- [ ] Real-time enabled in Supabase
- [ ] `npm run dev` works without errors
- [ ] Can see map on tracking page

---

## 🎯 ACCESS THE FEATURE

**URL Format:**
```
/bus/{busId}/tracking
```

**Examples:**
```
http://localhost:5173/bus/test-bus-001/tracking
http://localhost:5173/bus/bus-101/tracking
http://localhost:5173/bus/route-delhi-airport/tracking
```

---

## 💡 QUICK TIPS

### See All Files Created
```bash
ls -la src/lib/mapConfig.ts
ls -la src/services/mapService.ts
ls -la src/hooks/useGPSTracking.ts
ls -la src/components/BusMap.tsx
ls -la src/pages/LiveTracking.tsx
ls -la supabase/migrations/20251108000000_gps_tracking_setup.sql
```

### Verify API Key Works
```bash
# In browser console:
console.log(window.google)
# Should show Google Maps object
```

### Check Real-time Connection
```bash
# In browser console:
supabase.getChannels()
# Should show bus-locations and bus-status channels
```

---

## 🔧 CUSTOMIZE

### Change Default City
Edit `src/lib/mapConfig.ts`:
```typescript
defaultCenter: {
  lat: 28.7041,    // Your city latitude
  lng: 77.1025,    // Your city longitude
},
```

### Change Update Frequency
Edit `src/lib/mapConfig.ts`:
```typescript
trackingConfig: {
  updateInterval: 5000,  // 5000ms = 5 seconds (reduce for faster updates)
}
```

### Change Map Colors
Edit `src/lib/mapConfig.ts`:
```typescript
STATUS_COLORS = {
  on_time: "#10b981",    // Green
  delayed: "#f97316",    // Orange
  completed: "#8b5cf6",  // Purple
}
```

---

## 🆘 IF SOMETHING'S WRONG

### Map shows blank/error message?
```
✓ Check browser console for errors
✓ Verify VITE_GOOGLE_MAPS_API_KEY in .env
✓ Make sure API key is unrestricted or includes your domain
✓ Check Google Maps script is in index.html
```

### Real-time updates not working?
```
✓ Verify real-time is enabled in Supabase
✓ Check WebSocket in browser DevTools Network tab
✓ Insert test data manually
✓ Check Supabase connection is working
```

### "Cannot read property 'google' of undefined"
```
✓ Add script tag to index.html head
✓ Verify API key is valid
✓ Check network tab - is Google Maps script loaded?
```

---

## 📚 NEED MORE HELP?

- **Full Setup Guide**: See `LIVE_TRACKING_SETUP.md`
- **Improvement Roadmap**: See `IMPROVEMENT_ROADMAP.md`
- **Implementation Details**: See `IMPLEMENTATION_COMPLETE.md`
- **Environment Setup**: See `.env.example`

---

## 🎉 YOU'RE READY!

Once you see the map with bus marker, you're all set! 🗺️🚌

Next steps:
1. Add actual bus GPS data
2. Update bus locations regularly
3. Deploy to production
4. Celebrate! 🎊

---

**Good luck! 🚀**
