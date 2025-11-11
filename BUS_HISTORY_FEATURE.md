# Bus History Feature Documentation

## Overview

The **Bus History** section displays all reports and feedback submitted across all buses in a centralized, easy-to-browse feed. This feature is integrated into the Professional Home page and provides real-time visibility into the community's reports and feedback.

## Features

### 1. **Unified Feed**
- Combines all **Feedback** and **Incident Reports** from all buses
- Displays items in reverse chronological order (newest first)
- Shows up to 100 recent items
- Auto-refreshes and includes manual refresh button

### 2. **Filtering**
Three filter options available:
- **All**: Shows both feedback and incident reports
- **Feedback**: Shows only user feedback submissions
- **Incident**: Shows only safety incident reports

Each filter shows a count badge indicating the number of items.

### 3. **Item Display**

Each history item card shows:
- **Category Badge**: Colored by type (e.g., "Cleanliness", "Safety", "Driver", etc.)
- **Type Badge**: Indicates "Feedback" or "Report"
- **Bus ID**: Which bus the report is about
- **Timestamp**: Relative time (e.g., "2h ago", "Just now")
- **Expand/Collapse Control**: Chevron icon to reveal full details

### 4. **Expanded Details**
When you click on a history item, it expands to show:
- **Full Description**: Complete text of the report/feedback
- **Attached Image**: If any photos were submitted
- **Full Timestamp**: Exact date and time
- **Item ID**: First 8 characters of the UUID

### 5. **Visual Indicators**

#### By Type:
- **Incidents** (Reports): Red left border, alert icon, red badges
- **Feedback**: Blue left border, message icon, category-colored badges

#### Category Colors:
- **Cleanliness**: Amber/Orange
- **Safety**: Red
- **Comfort**: Blue
- **Service**: Green
- **Driver**: Purple
- **Other**: Gray

## Component Structure

### File Location
```
src/components/bus/BusHistoryFeed.tsx
```

### Component Name
```typescript
BusHistoryFeed
```

### Integration
Integrated into `/src/pages/ProfessionalHome.tsx`

## Data Flow

```
Database (Supabase)
    ↓
Feedback Table + Incidents Table
    ↓
BusHistoryFeed Component
    ↓
Filtered by User Selection
    ↓
Displayed in Cards with Details
```

## Database Tables Used

### Feedback Table
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY,
  bus_id TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP
)
```

### Incidents Table
```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY,
  bus_id TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP
)
```

## Usage

### For Users
1. Open the app and navigate to the home page
2. Scroll to the **"Bus History"** section
3. View all recent feedback and reports
4. Click on any item to expand and see full details
5. Use filter buttons to show specific types
6. Click "Refresh" button to manually reload data

### For Developers

#### Import the Component
```typescript
import { BusHistoryFeed } from '@/components/bus/BusHistoryFeed';
```

#### Use in Your Page
```tsx
<div className="space-y-3 pt-6 border-t border-gray-200">
  <BusHistoryFeed />
</div>
```

#### Component Props
Currently, the component accepts no props and manages all state internally. All configuration is done through database queries.

## Console Logging

The component logs important information for debugging:

```javascript
// On component mount
console.log('Fetching history...');

// When data is loaded
console.log(`Loaded ${combined.length} history items:`, combined);

// When no items found
console.log('No history items found');
```

**Check the browser console (F12) to verify data is loading correctly.**

## Error Handling

- **Failed to load bus history**: Toast notification appears if Supabase query fails
- **No history items**: Graceful empty state with helpful message
- **Network errors**: Caught and logged to console

## Performance Considerations

1. **Limit**: Fetches maximum 100 recent items from each table
2. **Sorting**: Results sorted by `created_at` in descending order
3. **Optimization**: Uses `.limit(100)` to prevent loading excessive data
4. **Image Loading**: Images lazy-load when expanded (in card)

## Future Enhancements

Potential improvements for future versions:

1. **Pagination**: Load 10 items initially, "Load More" button for additional items
2. **Search**: Add search box to find feedback by keyword
3. **Date Range Filter**: Filter by date range (Today, This Week, This Month)
4. **Bus-Specific Filter**: Quick filter to show history for specific bus routes
5. **Sorting Options**: Sort by date (newest/oldest), popularity, or rating
6. **Export**: Download reports as CSV or PDF
7. **Analytics**: Show charts with feedback trends
8. **Real-time Updates**: Subscribe to new feedback/incidents for live updates
9. **User Information**: Show which user submitted each report (with privacy controls)
10. **Severity Levels**: For incidents, show high/medium/low severity indicators

## Testing Checklist

- [ ] Bus History section appears on Professional Home page
- [ ] "All" filter shows both feedback and incidents
- [ ] "Feedback" filter shows only feedback items
- [ ] "Incident" filter shows only incident reports
- [ ] Click to expand/collapse works correctly
- [ ] Images display properly when expanded
- [ ] Refresh button reloads data
- [ ] Empty state displays when no items found
- [ ] Relative timestamps update correctly (e.g., "2h ago")
- [ ] Category badges show correct colors
- [ ] Console logs appear for debugging
- [ ] No errors in browser console (F12)
- [ ] Loading skeleton appears while fetching
- [ ] Toast notifications appear on errors

## Troubleshooting

### No items appearing?

1. **Check Console Logs**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for `"Loaded 0 history items"` or error messages

2. **Verify Supabase Connection**
   - Check that Supabase client is properly configured
   - Verify feedback/incidents tables exist
   - Run SQL query: `SELECT COUNT(*) FROM feedback; SELECT COUNT(*) FROM incidents;`

3. **Check Data Exists**
   - Submit test feedback or incident
   - Wait a few seconds
   - Click Refresh button
   - Check console for new data

### Images not loading?

- Verify image URLs in database are correct
- Check Supabase storage bucket permissions
- Ensure bucket names match (`feedback-images`, `incident-images`)

### Refresh button not working?

- Click it again to retry
- Check browser console for errors
- Verify Supabase connection is active
- Try refreshing the page (F5)

## Code Examples

### Basic Integration
```typescript
import { BusHistoryFeed } from '@/components/bus/BusHistoryFeed';

export const YourPage = () => {
  return (
    <div>
      <h1>Bus Information</h1>
      <BusHistoryFeed />
    </div>
  );
};
```

### Styling Integration
```typescript
// Works with Tailwind CSS classes
<div className="space-y-3 pt-6 border-t border-gray-200">
  <BusHistoryFeed />
</div>
```

## Related Components

- **FeedbackHistory**: Shows only user's own feedback (Profile page)
- **IncidentHistory**: Shows only user's own incidents (Profile page)
- **BusHistoryFeed**: Shows ALL feedback and incidents across ALL buses (Home page)

## API Endpoints Used

The component uses the following Supabase queries:

```typescript
// Get all feedback
supabase
  .from('feedback')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(100)

// Get all incidents
supabase
  .from('incidents')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(100)
```

## Notes

- The component is designed to be lightweight and performant
- All data is fetched on component mount
- Manual refresh is available via button click
- Component manages its own state (loading, expanded items, filters)
- Error handling includes toast notifications and console logging
- Images are stored in Supabase Storage with public URLs

## Contact & Support

For issues or feature requests related to this component:
1. Check browser console (F12) for error messages
2. Verify Supabase connection and data
3. Review this documentation
4. Check the project README for general troubleshooting
