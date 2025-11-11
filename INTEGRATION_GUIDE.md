# Integration Guide: Distance & Time Tracking

## Overview

This guide explains how to integrate the new distance and time tracking feature into your Bus Watch Plus application.

## ✅ What's Already Integrated

The feature is **automatically integrated** in:

1. **Bus Details Page** (`/bus/:busId`)
   - LiveStatus component shows map with user location
   - Distance and time display automatically

2. **Live Tracking Page** (`/bus/:busId/tracking`)
   - Enhanced with user location
   - Shows real-time distance updates

## 🚀 How to Test

### Step 1: Start the Development Server
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

### Step 2: Open the Application
```
http://localhost:5173
```

### Step 3: Navigate to Bus Details
1. Login if needed
2. Search for or enter a bus ID (e.g., "BUS-001")
3. Click "View Bus Details"
4. Click the "Status" tab

### Step 4: Allow Location Access
1. Browser will ask for location permission
2. Click "Allow" to share your GPS location
3. Wait for map to load

### Step 5: See the Magic ✨
- Green dot = Your location
- Blue icon = Bus location (Madurai)
- Dashed line = Route between you and bus
- Cards show distance and estimated time

## 📦 Components & Files

### Used by BusMap Component
```typescript
import { useUserLocation } from '@/hooks/useUserLocation';
import { calculateDistance, calculateETA, formatTimeRemaining } from '@/services/mapService';
```

### Exported Functions
```typescript
// Distance calculation
calculateDistance(from, to, unit) → number

// Time calculation
calculateETA(from, to, speed) → Date

// Format time
formatTimeRemaining(eta) → string
```

## 🔄 Integration Points

### Option 1: Use Existing Integration (Recommended)
Just use the updated components - everything is already wired!

```tsx
// LiveStatus component automatically shows location
// Just ensure user allows permission when prompted
```

### Option 2: Add to New Pages
Use the QuickMapTracker component:

```tsx
import { QuickMapTracker } from '@/components/QuickMapTracker';

export function MyTrackingPage() {
  return (
    <QuickMapTracker 
      busStatus={busData}
      onLocationChange={(location) => {
        console.log('User moved to:', location);
      }}
    />
  );
}
```

### Option 3: Use Hooks Directly
```tsx
import { useUserLocation } from '@/hooks/useUserLocation';
import { BusMap } from '@/components/BusMap';

export function CustomTracking() {
  const { location } = useUserLocation();
  
  return (
    <BusMap 
      busStatus={busData}
      userLocation={location}
      height="h-96"
    />
  );
}
```

## 🎯 Common Integration Scenarios

### Scenario 1: Add to Dashboard
```tsx
import { QuickMapTracker } from '@/components/QuickMapTracker';

export function Dashboard() {
  return (
    <div>
      <h1>Bus Tracking Dashboard</h1>
      <QuickMapTracker busStatus={selectedBus} />
    </div>
  );
}
```

### Scenario 2: Add to Mobile App
```tsx
import { useUserLocation } from '@/hooks/useUserLocation';

export function MobileTracking() {
  const { location, error, loading } = useUserLocation({
    enableHighAccuracy: true,
    watchPosition: true
  });
  
  if (loading) return <Loader />;
  if (error) return <Error msg={error} />;
  
  return <BusMap userLocation={location} busStatus={bus} />;
}
```

### Scenario 3: Add to Notification System
```tsx
import { useUserLocation } from '@/hooks/useUserLocation';
import { calculateDistance } from '@/services/mapService';

export function ProximityNotifier() {
  const { location } = useUserLocation();
  
  // Notify when user is within 2 km of bus
  useEffect(() => {
    if (location) {
      const distance = calculateDistance(location, BUS_LOCATION);
      if (distance < 2) {
        showNotification('Bus is nearby!');
      }
    }
  }, [location]);
  
  return null;
}
```

## 🔧 Configuration

### Configure User Location Hook
```tsx
const { location } = useUserLocation({
  enableHighAccuracy: true,    // Use GPS (more battery)
  timeout: 10000,              // Wait up to 10 seconds
  maximumAge: 0,               // Always get fresh data
  watchPosition: true          // Continuous tracking
});
```

### Configure Bus Speed for ETA
```typescript
// In BusMap.tsx or component using it
const eta = calculateETA(
  userLocation,
  BUS_LOCATION,
  40  // Change this to your average bus speed
);
```

### Configure Bus Location
```typescript
// In BusMap.tsx
const BUS_LOCATION = { 
  lat: 9.9252,  // Change latitude
  lng: 78.1198  // Change longitude
};
```

## 🐛 Debugging

### Check if Location is Working
```tsx
import { useUserLocation } from '@/hooks/useUserLocation';

export function DebugLocation() {
  const { location, error, loading } = useUserLocation();
  
  return (
    <div>
      <p>Loading: {loading ? 'yes' : 'no'}</p>
      <p>Error: {error || 'none'}</p>
      <p>Location: {location ? 
        `${location.lat}, ${location.lng}` : 
        'not available'}</p>
    </div>
  );
}
```

### Check Browser Console
```javascript
// In browser console (F12)
navigator.geolocation.getCurrentPosition(
  pos => console.log('Location:', pos.coords),
  err => console.log('Error:', err.message)
);
```

### Check Map Rendering
```tsx
// Ensure Leaflet CSS is imported
import 'leaflet/dist/leaflet.css';

// Check in browser dev tools
// Elements tab → Look for .leaflet-container
```

## 🛠️ Troubleshooting Integration

### Issue: Map not showing
```
Solution:
1. Check Leaflet CSS import in BusMap.tsx
2. Ensure map container has height (h-96)
3. Check browser console for errors
4. Clear cache and reload
```

### Issue: Location not updating
```
Solution:
1. Check browser location permission
2. Ensure GPS is enabled on device
3. Verify useUserLocation is called
4. Check watchPosition: true
```

### Issue: Wrong distance shown
```
Solution:
1. Verify BUS_LOCATION coordinates
2. Check user location is real GPS
3. Ensure distance calculation unit matches
4. Verify both lat/lng are correct
```

### Issue: Performance issues
```
Solution:
1. Reduce watchPosition update frequency
2. Use memoization on components
3. Check for unnecessary re-renders
4. Monitor network tab for API calls
```

## 📱 Mobile Considerations

### For iOS
- Requires HTTPS
- May require app permission in Settings > Location
- GPS takes a few seconds to initialize

### For Android
- Works with HTTP in development
- Requires location permission in app settings
- More reliable GPS support

### Best Practices
```tsx
// Use watchPosition for continuous updates
const { location } = useUserLocation({
  watchPosition: true,
  enableHighAccuracy: true
});

// Clean up on unmount (handled automatically)
// Show loading state while getting location
// Handle errors gracefully
```

## 🧪 Testing the Feature

### Test 1: Basic Integration
```
1. Open /bus/any-id
2. Check if map displays
3. Allow location when asked
4. Verify distance shows
5. Verify time shows
```

### Test 2: Real-Time Updates
```
1. Open tracking page
2. Note the distance
3. Move to a different location
4. Verify distance updated
5. Verify time updated
```

### Test 3: Error Handling
```
1. Deny location permission
2. Verify error message shows
3. Verify map still displays
4. Verify graceful fallback
```

### Test 4: Mobile Responsive
```
1. Open on mobile device
2. Allow location permission
3. Verify map is responsive
4. Verify cards are readable
5. Test on both portrait/landscape
```

## 📊 Performance Monitoring

### Monitor Location Updates
```tsx
useEffect(() => {
  if (location) {
    console.log('Location updated:', location);
  }
}, [location?.lat, location?.lng]);
```

### Monitor Distance Calculations
```tsx
useEffect(() => {
  if (userLocation && distanceBetween) {
    console.log('Distance calculated:', distanceBetween, 'km');
  }
}, [distanceBetween]);
```

### Monitor Re-renders
```tsx
useEffect(() => {
  console.log('Component rendered');
  return () => console.log('Component unmounted');
}, []);
```

## 🎨 Customization

### Change UI Colors
Edit in `BusMap.tsx`:
```tsx
// Change gradient colors
className="bg-gradient-to-r from-blue-500 to-blue-600"

// Change icon colors
className="text-blue-600"

// Change border colors
className="border-blue-200"
```

### Change Map Style
Edit in `BusMap.tsx`:
```typescript
// Change tile provider (currently OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  // Switch to different provider
});
```

### Change Marker Icons
Edit in `BusMap.tsx`:
```typescript
// Customize SVG for bus marker
const busIcon = L.icon({
  iconUrl: 'data:image/svg+xml,...',
  iconSize: [40, 40],  // Change size
  // Add more customization
});
```

## 📚 Related Documentation

- [DISTANCE_TIME_TRACKING.md](./DISTANCE_TIME_TRACKING.md) - Full technical docs
- [DISTANCE_TIME_QUICK_START.md](./DISTANCE_TIME_QUICK_START.md) - Quick start guide
- [DISTANCE_TIME_IMPLEMENTATION.md](./DISTANCE_TIME_IMPLEMENTATION.md) - Implementation details

## ✨ What's Included

### New Components
- `useUserLocation` hook - Get user GPS location
- `QuickMapTracker` component - Complete tracking UI
- Enhanced `BusMap` - Shows distance and time

### Modified Components
- `LiveStatus` - Integrated user location
- `LiveTracking` - Uses new location hook

### Utilities
- `calculateDistance()` - Haversine distance
- `calculateETA()` - Time calculation
- `formatTimeRemaining()` - Time formatting

## 🚀 Next Steps

1. **Test in browser** - Allow location permission
2. **Test on mobile** - Check responsive design
3. **Test error cases** - Deny permission, disable GPS
4. **Monitor performance** - Check console and network
5. **Customize as needed** - Colors, locations, speeds

## 📞 Questions?

Refer to:
1. Component source code (inline comments)
2. Documentation files
3. TypeScript interfaces (for API)
4. Test files (for examples)

---

**Status**: ✅ Ready to integrate and test!

All components are production-ready and fully documented. 🎉
