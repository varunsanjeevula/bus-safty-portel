# Debugging Guide - Feedback & Incident Display Issues

## The Issue
Feedback and incident reports are submitted but not displaying in the history tabs.

## Root Cause
The data IS being saved to Supabase, but the history components weren't fetching it properly. This has been fixed with:
1. ✅ Console logging to trace data flow
2. ✅ Improved error handling
3. ✅ Refresh button to manually reload data
4. ✅ Better loading states

## How to Verify Data is Being Saved

### Step 1: Check Browser Console
1. Open your app in browser
2. Press `F12` to open DevTools
3. Click the "Console" tab
4. You should see logs like:
   ```
   Fetching feedback...
   Feedback fetched: [...]
   ```

### Step 2: Check Supabase Directly
1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Click "SQL Editor" on the left
4. Run this query:
   ```sql
   SELECT * FROM feedback ORDER BY created_at DESC LIMIT 10;
   ```
5. You should see your feedback records

6. For incidents:
   ```sql
   SELECT * FROM incidents ORDER BY created_at DESC LIMIT 10;
   ```

### Step 3: Check Storage Buckets
1. In Supabase Dashboard
2. Click "Storage" on the left
3. Check `feedback-images` bucket - should have uploaded photos
4. Check `incident-images` bucket - should have uploaded evidence photos

## Step-by-Step: Submit and View Feedback

### Submit Feedback
1. Go to http://localhost:8081/
2. Click on any bus marker on the map
3. Click "Submit Feedback" button
4. **Select a category** (required)
5. **Rate the driver** with stars (required)
6. **Optional**: Add photos or description
7. Click "Submit Feedback"
8. You should see a success message ✓

### View in History
1. Click the **Profile icon** (bottom navigation)
2. Click the **"Feedback"** tab
3. You should see your feedback listed
4. Click **"Show Details"** to expand and see full info
5. If no feedback appears:
   - Click the **"Refresh"** button
   - Check browser console for errors (F12)
   - Check Supabase dashboard for records

---

## Common Issues & Solutions

### Issue: "No Feedback Yet" message appears
**Solution**:
1. Did you submit feedback? Go back and submit one first
2. Click the "Refresh" button in the Feedback tab
3. Check browser console for errors (F12 → Console)
4. Check Supabase: Is the data in the database?

### Issue: See errors in console like "Failed to load feedback"
**Solution**:
1. Check your Supabase connection
2. Verify API keys in `.env.local`
3. Check Supabase project is active
4. Try logging out and back in

### Issue: Photos uploaded but not showing
**Solution**:
1. Check Supabase Storage buckets:
   - `feedback-images` should have files
   - `incident-images` should have files
2. Check that bucket permissions allow "public read"
3. Verify URLs are accessible (click on photo link)

### Issue: Database shows data but history still empty
**Solution**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. You'll see logs: "Fetching feedback..." and "Feedback fetched: [...]"
4. If data is empty, the query returned nothing
5. Try different filters or check database directly

---

## Testing Workflow

### Test 1: Basic Submission
```
1. Go to Bus Details
2. Click "Submit Feedback"
3. Select category ← Required
4. Rate driver (1-5) ← Required
5. Click Submit
6. Should see success message
7. Go to Profile → Feedback tab
8. Should see your feedback in list
✓ PASS if feedback appears
```

### Test 2: With Photos
```
1. Go to Bus Details
2. Click "Submit Feedback"
3. Select category
4. Rate driver
5. Click "Click to upload photos"
6. Select 1-2 photos
7. Click Submit
8. Check Profile → Feedback tab
9. Expand card, should see photo thumbnail
10. Click photo to view full size
✓ PASS if photos display
```

### Test 3: With Camera
```
1. Go to Bus Details
2. Click "Submit Feedback"
3. Select category & rate driver
4. Click "Take Photos Now"
5. Allow camera permission
6. Click "Capture Photo"
7. Click Submit
8. Check Profile → Feedback tab
✓ PASS if camera photo appears
```

### Test 4: Incident Report
```
1. Go to Bus Details
2. Click "Report Incident"
3. Select incident category ← Required
4. Select severity ← Required
5. Rate driver behavior
6. Add evidence photos or use camera
7. Write description ← Required
8. Click "Submit Incident Report"
9. Go to Profile → Incidents tab
10. Should see incident with severity badge
✓ PASS if incident appears
```

---

## Console Debug Output Expected

### When Visiting Feedback Tab
```
Console shows:
> Fetching feedback...
> Supabase error: (if any)
> Feedback fetched: [
    { id: "...", bus_id: "...", category: "Driver Behavior", ... },
    ...
  ]
```

### When Visiting Incidents Tab
```
Console shows:
> Fetching incidents...
> Incidents fetched: [
    { id: "...", bus_id: "...", category: "Unsafe Driving", ... },
    ...
  ]
```

### If Nothing Appears
```
Console should show at least:
> Fetching feedback...
> Feedback fetched: []  ← Empty array means no data

Or:
> Failed to fetch feedback: [Error details]
```

---

## Quick Database Queries

### Check Feedback Count
```sql
SELECT COUNT(*) as feedback_count FROM feedback;
```

### Check Latest Feedback
```sql
SELECT * FROM feedback ORDER BY created_at DESC LIMIT 5;
```

### Check Feedback by Bus
```sql
SELECT * FROM feedback WHERE bus_id = 'YOUR_BUS_ID';
```

### Check All Incidents
```sql
SELECT * FROM incidents ORDER BY created_at DESC LIMIT 10;
```

### Check Incidents by Bus
```sql
SELECT * FROM incidents WHERE bus_id = 'YOUR_BUS_ID';
```

### Check Storage Files
```
Go to: Supabase → Storage → feedback-images
See files like: feedback-BUS-123-1701234567890-a1b2c3d4.jpg
```

---

## Refresh Functionality

The history components now have a **Refresh** button:

1. In Feedback tab - Click "Refresh" button (top right)
2. In Incidents tab - Click "Refresh" button (top right)
3. This forces fetching latest data from Supabase
4. Check console to see if data arrives

---

## Manual Testing Steps

### After Each Submit:
1. ✓ Check success message appears
2. ✓ Go to Profile
3. ✓ Click Feedback or Incidents tab
4. ✓ Click Refresh button
5. ✓ Check console (F12) for any errors
6. ✓ Verify data appears in list
7. ✓ Click "Show Details" to expand
8. ✓ Verify photos/info display

### If Data Doesn't Appear:
1. Check console errors (F12 → Console)
2. Check Supabase dashboard directly
3. Verify network requests (F12 → Network tab)
4. Look for failed API calls
5. Check your internet connection

---

## Browser DevTools Network Tab

To see actual API calls:

1. Press F12 (Open DevTools)
2. Click "Network" tab
3. Submit feedback
4. You should see:
   - `POST` to storage upload (for photos)
   - `POST` to insert feedback
   - `GET` to fetch feedback (when opening history)
5. Check response code is `200` or `201`
6. If errors: Check response body for error message

---

## Summary

**The System Should Now Work As Follows:**

1. **Submit feedback** → Data saved to Supabase ✓
2. **Navigate to Profile** → Feedback tab fetches data ✓
3. **Data loads** → Shows in list with refresh button ✓
4. **Console logs** → Show data fetching process ✓
5. **Click Refresh** → Manually reload if needed ✓
6. **Expand cards** → View full details and photos ✓

If any step fails, check the console (F12) for error messages!

---

## Next Steps If Still Not Working

1. **Check console (F12 → Console)** for error messages
2. **Check Supabase dashboard** - is the data there?
3. **Check Network tab (F12 → Network)** - are API calls succeeding?
4. **Restart the dev server** - sometimes helps
5. **Clear browser cache** - might be loading old code
6. **Check Supabase project** - is it active and responsive?

Let me know what errors you see in the console and I can help debug further! 🔍
