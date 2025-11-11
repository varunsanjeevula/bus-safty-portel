# Quick Start: Distance & Time Tracking

## What's New?

The app now shows:
- 📍 Your real location (from GPS)
- 🚌 Bus location (Madurai as mock)
- 📏 Distance between you and the bus
- ⏱️ Estimated time to reach the bus

## How to Use

### 1. **On the Bus Details Page**

1. Go to any bus page (`/bus/:busId`)
2. Click on "Status" tab
3. The map now shows:
   - Your location (green dot) - if you allow location access
   - Bus location (blue bus icon) - Madurai
   - A dashed line connecting both
   - Distance and time cards below the map

### 2. **Enable Location Access**

When you first open the map:
1. Browser asks for location permission
2. Click **"Allow"** to share your GPS location
3. Map updates with your real position
4. Distance and time calculate automatically

### 3. **See Real-Time Updates**

As you move:
- Your marker moves on the map
- Distance number updates
- Estimated time recalculates
- All updates happen automatically

## What You'll See

### Distance Card (Blue)
```
📍 Distance to Bus
   12.5 km away
```

### Time Card (Green)
```
⏱️ Estimated Time
   18 mins
   at 40 km/h average
```

### Map
```
[Map showing:]
- Green dot = Your location
- Blue bus = Bus location (Madurai)
- Dashed line = Route between you and bus
```

## Requirements

✅ **Browser Support:**
- Chrome/Edge ✓
- Firefox ✓
- Safari ✓
- Mobile browsers ✓

✅ **What You Need:**
- GPS or WiFi location
- Permission to share location
- HTTPS connection (production)

## Troubleshooting

### "Location access denied"
**Solution:**
1. Go to browser settings
2. Find "Privacy" or "Location" settings
3. Allow location for this website
4. Refresh the page

### "Map not showing"
**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check JavaScript is enabled

### "Distance not updating"
**Solution:**
1. Check location permission is granted
2. Ensure GPS is enabled on device
3. Move around and wait a few seconds
4. Check browser console for errors

### "Wrong distance shown"
**Solution:**
1. The bus location is fixed (Madurai mock)
2. Your location should be real GPS
3. Distance calculates based on both coordinates
4. Accuracy improves when you move

## Technical Details

### Location API
- Uses **Geolocation API** (browser native)
- Continuous position watching
- Updates every time you move

### Distance Calculation
- Uses **Haversine formula** (Turf.js library)
- Accurate to ±0.01 km
- Works globally

### Speed Assumption
- **Default: 40 km/h** (average city bus speed)
- ETA = Distance ÷ Speed × 60 minutes
- You can customize in code if needed

### Mock Bus Location
- **Madurai, India**
- Latitude: 9.9252°N
- Longitude: 78.1198°E
- Used for testing/demo purposes

## Integration Points

### 1. Bus Details Page
```
/bus/:busId → LiveStatus → BusMap with user location
```

### 2. Live Tracking Page
```
/bus/:busId/tracking → Shows distance + ETA
```

### 3. Custom Pages
Use the **QuickMapTracker** component on any page:
```tsx
import { QuickMapTracker } from '@/components/QuickMapTracker';

<QuickMapTracker busStatus={bus} />
```

## Files Changed

### New Files Created
1. `src/hooks/useUserLocation.ts` - Gets user's GPS location
2. `src/components/QuickMapTracker.tsx` - Complete tracker UI

### Files Enhanced
1. `src/components/BusMap.tsx` - Shows both locations + distance
2. `src/components/bus/LiveStatus.tsx` - Integrated user location
3. `src/pages/LiveTracking.tsx` - Uses new location hook

## Code Examples

### Get User Location
```tsx
import { useUserLocation } from '@/hooks/useUserLocation';

function MyComponent() {
  const { location, error, loading } = useUserLocation();
  
  if (loading) return <div>Getting location...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      Your location: {location?.lat}, {location?.lng}
    </div>
  );
}
```

### Calculate Distance
```tsx
import { calculateDistance } from '@/services/mapService';

const distance = calculateDistance(
  { lat: 9.9252, lng: 78.1198 },  // Madurai
  { lat: 28.7041, lng: 77.1025 }, // User location
  'kilometers'
);
console.log(`Distance: ${distance} km`);
```

### Show Distance on Map
```tsx
import { BusMap } from '@/components/BusMap';
import { useUserLocation } from '@/hooks/useUserLocation';

function TrackPage() {
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

## Performance Notes

✅ **Optimized for:**
- Mobile devices
- Slow networks
- Battery efficiency
- Real-time updates

⚡ **What's Efficient:**
- Map renders only once
- Location updates every few seconds
- Distance calculations in useEffect
- Components memoized to prevent re-renders

## Next Steps

1. **Test it out:**
   - Open browser dev tools (F12)
   - Go to `/bus/any-bus-id`
   - Check network tab for location requests

2. **Allow location:**
   - Click the notification popup
   - Select "Allow" when asked

3. **See it in action:**
   - Move around
   - Watch distance change
   - See time estimate update

## Questions?

Check the full documentation: [DISTANCE_TIME_TRACKING.md](./DISTANCE_TIME_TRACKING.md)

Or look at the code:
- `src/hooks/useUserLocation.ts` - Location hook
- `src/components/BusMap.tsx` - Map component
- `src/services/mapService.ts` - Distance calculations

---

**Happy Tracking! 🚌📍✨**
