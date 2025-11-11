# Distance & Time Tracking Feature Documentation

## Overview

This feature shows the real-time distance and estimated travel time between a user's actual GPS location and the bus location (using Madurai as a mock location for demonstration).

## Features

### 1. **Real-Time User Location Tracking**
- Uses browser's Geolocation API for real-time GPS tracking
- Continuous position watching with high accuracy
- Handles location permission requests and errors gracefully

### 2. **Distance Calculation**
- Calculates distance using Haversine formula (via Turf.js)
- Displays distance in kilometers
- Automatically updates as user moves

### 3. **Estimated Time Calculation**
- Calculates ETA based on distance and bus speed (40 km/h average)
- Shows time remaining in human-readable format (e.g., "12 mins", "1h 30m")
- Updates in real-time as positions change

### 4. **Interactive Map**
- Shows both user location (green marker) and bus location (blue marker)
- Displays dashed route line between user and bus
- Automatically fits map bounds to show both locations
- Leaflet-based mapping (OpenStreetMap - no API key required)

### 5. **Visual Distance & Time Cards**
- Beautiful gradient cards showing distance and ETA
- Status indicators and icons for quick understanding
- Responsive design for mobile and desktop

## Components

### `useUserLocation.ts` Hook

```typescript
// Get user's real-time location
const { location, error, loading } = useUserLocation({
  enableHighAccuracy: true,  // Use GPS instead of WiFi
  watchPosition: true,       // Continuously watch position
  timeout: 10000,            // Wait up to 10 seconds
  maximumAge: 0              // Always get fresh data
});

// Returns:
// - location: { lat, lng, accuracy, timestamp }
// - error: error message if location access denied
// - loading: boolean indicating if location is being fetched
```

### `BusMap.tsx` Component

Enhanced map component showing:
- User's real location (green marker)
- Bus location (blue marker - Madurai)
- Distance line connecting both
- Distance and time information card

**Props:**
```typescript
interface BusMapProps {
  busStatus: BusStatus | null;        // Bus information
  userLocation?: { lat: number; lng: number } | null;  // User's location
  height?: string;                    // Map height (default: 'h-96')
}
```

**Usage:**
```tsx
import { BusMap } from '@/components/BusMap';
import { useUserLocation } from '@/hooks/useUserLocation';

function MyComponent() {
  const { location: userLocation } = useUserLocation();
  
  return (
    <BusMap 
      busStatus={busStatus}
      userLocation={userLocation}
      height="h-96"
    />
  );
}
```

### `QuickMapTracker.tsx` Component

Complete tracking component combining:
- Map display with user and bus locations
- Distance and time information cards
- Location accuracy display
- Error handling for permission issues
- Loading state indicators

**Usage:**
```tsx
import { QuickMapTracker } from '@/components/QuickMapTracker';

function TrackingPage() {
  return (
    <QuickMapTracker 
      busStatus={busStatus}
      onLocationChange={(location) => {
        console.log('User location updated:', location);
      }}
    />
  );
}
```

## Integration Points

### 1. **BusDetails Page** (`/bus/:busId`)
- LiveStatus component now shows user location on map
- Distance and time displayed alongside bus info
- Real-time updates as user moves

### 2. **Live Tracking Page** (`/bus/:busId/tracking`)
- Enhanced with user location
- Shows distance between user and bus
- Real-time ETA calculations

### 3. **Standalone Tracking Component**
- QuickMapTracker can be used on any page
- Great for dashboard or home page

## How It Works

### Distance Calculation Flow

```
User Location (Real GPS)
         ↓
Calculate Distance using Haversine
         ↓
Bus Location (Madurai Mock)
         ↓
Display in KM with accuracy
```

### Time Calculation Flow

```
Distance (km) + Average Speed (40 km/h)
         ↓
Time = (Distance / Speed) * 60 minutes
         ↓
Format as "12 mins", "1h 30m", etc.
```

### Map Display Flow

```
User Location Data (useUserLocation hook)
         ↓
BusMap Component receives userLocation prop
         ↓
Render both markers on Leaflet map
         ↓
Draw route line between markers
         ↓
Auto-fit bounds to show both points
```

## Browser Requirements

### Geolocation API Requirements
- HTTPS connection (required for production)
- User permission to access location
- GPS or network-based location service

### Browser Support
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Mock Location

**Bus Location (Madurai, India):**
- Latitude: 9.9252°N
- Longitude: 78.1198°E
- This is used as the mock bus location for testing

**User Location:**
- Real-time GPS from browser
- Automatically updated as user moves
- Accuracy varies based on device and conditions

## Error Handling

### Permission Denied
```
"Permission denied. Please enable location access in browser settings."
```
- User needs to allow location access
- Check browser settings → Privacy → Location

### Position Unavailable
```
"Location information is unavailable."
```
- GPS/WiFi services not available
- Device may be in airplane mode
- Check network/location settings

### Timeout
```
"The request to get user location timed out."
```
- Takes too long to get location
- May happen in areas with weak GPS signal
- Automatic retry on next attempt

## Customization

### Change Bus Speed Calculation

Edit in `QuickMapTracker.tsx` or `BusMap.tsx`:
```typescript
// Default: 40 km/h
const eta = calculateETA(userLocation, BUS_LOCATION, 40);

// Change to 50 km/h
const eta = calculateETA(userLocation, BUS_LOCATION, 50);
```

### Change Mock Bus Location

Edit in `BusMap.tsx`:
```typescript
// Current: Madurai
const BUS_LOCATION = { lat: 9.9252, lng: 78.1198 };

// Change to Delhi
const BUS_LOCATION = { lat: 28.7041, lng: 77.1025 };
```

### Change Map Height

```tsx
// Default: h-96 (384px)
<BusMap userLocation={userLocation} height="h-96" />

// Make taller
<BusMap userLocation={userLocation} height="h-screen" />

// Make shorter
<BusMap userLocation={userLocation} height="h-64" />
```

## Performance Optimizations

1. **Location Watching**
   - Only updates when position changes significantly
   - Reduces unnecessary re-renders
   - Configurable update frequency

2. **Map Rendering**
   - Leaflet map initialized only once
   - Markers updated without full map refresh
   - Memoized component to prevent unnecessary renders

3. **Distance Calculations**
   - Uses efficient Haversine formula
   - Calculated in useEffect (not on every render)
   - Results cached in component state

## Troubleshooting

### Map not showing
- Check browser console for errors
- Ensure Leaflet CSS is imported
- Verify map container has height set

### Location not updating
- Check browser permissions
- Ensure HTTPS in production
- Check GPS/WiFi availability
- Verify geolocation API support

### Wrong distance shown
- Clear browser cache and reload
- Verify locations are correct
- Check Turf.js import and usage

### Performance issues
- Reduce watchPosition frequency
- Limit map zoom levels
- Use memoization for components

## API Reference

### `calculateDistance(from, to, unit)`

```typescript
import { calculateDistance } from '@/services/mapService';

const distance = calculateDistance(
  { lat: 9.9252, lng: 78.1198 },  // from
  { lat: 28.7041, lng: 77.1025 }, // to
  'kilometers'                      // unit: 'kilometers' | 'meters' | 'miles'
);
// Returns: number (rounded to 2 decimals)
```

### `calculateETA(from, to, speed)`

```typescript
import { calculateETA } from '@/services/mapService';

const eta = calculateETA(
  { lat: 9.9252, lng: 78.1198 },  // current location
  { lat: 28.7041, lng: 77.1025 }, // destination
  40                               // average speed in km/h
);
// Returns: Date object with estimated arrival time
```

### `formatTimeRemaining(eta)`

```typescript
import { formatTimeRemaining } from '@/services/mapService';

const timeStr = formatTimeRemaining(etaDate);
// Returns: "Arrived" | "Arriving soon" | "1 min" | "12 mins" | "1h 30m"
```

## Future Enhancements

- [ ] Real-time bus location tracking (instead of mock)
- [ ] Multiple bus tracking on single map
- [ ] Route prediction based on traffic
- [ ] Push notifications for arrival
- [ ] Offline location caching
- [ ] Custom map styles
- [ ] Street-level directions
- [ ] Public transport integration

## Files Modified/Created

### New Files
- `src/hooks/useUserLocation.ts` - User location hook
- `src/components/QuickMapTracker.tsx` - Complete tracking component

### Modified Files
- `src/components/BusMap.tsx` - Enhanced with user location and distance display
- `src/components/bus/LiveStatus.tsx` - Integrated user location
- `src/pages/LiveTracking.tsx` - Integrated user location

## Testing Checklist

- [ ] Location permission dialog appears
- [ ] Distance updates as user moves
- [ ] Time estimates update correctly
- [ ] Map shows both markers
- [ ] Error messages display properly
- [ ] Mobile responsive works
- [ ] Works offline (uses cached data)
- [ ] Performance is smooth

## Support

For issues or questions, check:
1. Browser console for errors
2. Network tab for API calls
3. Geolocation permission status
4. Device GPS/location settings
