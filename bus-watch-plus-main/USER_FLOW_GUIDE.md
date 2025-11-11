# User Flow Guide - Feedback & Incident System

## 📱 How to Use the New Features

### 🎯 Scenario 1: Submit Feedback

#### Step 1: Navigate to Bus Details
```
Home Page (Map) 
  ↓ 
Click on a bus marker 
  ↓ 
BusDetails page opens
```

#### Step 2: Submit Feedback
```
Click "Submit Feedback" button
  ↓
SubmitFeedback component opens
```

#### Step 3: Select Category
```
Choose one of:
- Driver Behavior
- Cleanliness
- Safety Equipment
- Comfort
- Timeliness
- Other
```

#### Step 4: Rate the Driver
```
Click on stars to select rating:
⭐ 1 - Poor Service
⭐⭐ 2 - Below Average
⭐⭐⭐ 3 - Average
⭐⭐⭐⭐ 4 - Good
⭐⭐⭐⭐⭐ 5 - Excellent
```

#### Step 5: Add Photos (Optional)
```
Option A: Upload from Device
- Click "Click to upload photos from device"
- Select up to 5 images
- Thumbnails appear below

Option B: Take Photos
- Click "Take Photos Now"
- Camera opens
- Click "Capture Photo" for each photo
- Up to 5 photos allowed
```

#### Step 6: Add Description (Optional)
```
Type feedback details:
- What did you like/dislike?
- Specific issues?
- Suggestions?
```

#### Step 7: Submit
```
Click "Submit Feedback with X Photo(s)"
  ↓
Photos upload to Supabase
  ↓
Feedback record created
  ↓
Success message shown
  ↓
Form resets
```

---

### 🚨 Scenario 2: Report an Incident

#### Step 1: Navigate to Bus Details
```
Home Page (Map) 
  ↓ 
Click on a bus marker 
  ↓ 
BusDetails page opens
```

#### Step 2: Report Incident
```
Click "Report Incident" button
  ↓
ReportIncident page opens
```

#### Step 3: Select Incident Category
```
Choose one of:
- Unsafe Driving
- Equipment Failure
- Accident
- Medical Emergency
- Harassment
- Other Safety Concern
```

#### Step 4: Select Severity Level
```
Choose incident severity:
🟡 Low - Minor issue
🟠 Medium - Moderate concern
🔴 High - Serious violation
🔴 Critical - Emergency level
```

#### Step 5: Rate Driver Behavior
```
Use star rating:
⭐ 1 - Very Unsafe
⭐⭐ 2 - Unsafe
⭐⭐⭐ 3 - Neutral
⭐⭐⭐⭐ 4 - Mostly Safe
⭐⭐⭐⭐⭐ 5 - Very Safe
```

#### Step 6: Add Evidence Photos
```
Option A: Upload from Device
- Click upload area
- Select up to 10 photos
- Preview grid shows images

Option B: Capture with Camera
- Click "Take Photos Now"
- Camera opens with environment mode
- Capture up to 10 photos
- Photos appear in preview
```

#### Step 7: Describe Incident
```
Required: Write incident details
- What happened?
- When did it occur?
- Were there injuries?
- Any witnesses?
```

#### Step 8: Submit Report
```
Click "Submit Incident Report"
  ↓
Evidence photos upload
  ↓
Incident record created
  ↓
Confirmation message
  ↓
Redirect to bus details
```

---

### 📋 Scenario 3: View Feedback History

#### Step 1: Navigate to Profile
```
Main Navigation 
  ↓ 
Click Profile icon (bottom right)
  ↓ 
ProfessionalProfile page
```

#### Step 2: Open Feedback Tab
```
Click "Feedback" tab
  ↓
FeedbackHistory loads
```

#### Step 3: Browse Feedback
```
List shows all feedback:
- Category badge (colored)
- Date/time submitted
- Preview of description
- Photo indicator if exists
```

#### Step 4: View Full Details
```
Click "Show Details" button
  ↓
Card expands showing:
- Full description text
- Photo gallery (if exists)
- Bus ID
- Submission timestamp
```

#### Step 5: View Photo
```
Click on thumbnail photo
  ↓
Opens in new tab at full size
```

#### Step 6: Delete Feedback
```
Click trash icon
  ↓
Confirmation dialog
  ↓
"Are you sure?"
  ↓
Click confirm to delete
  ↓
Feedback removed from history
```

---

### 📋 Scenario 4: View Incident History

#### Step 1: Navigate to Profile
```
Main Navigation 
  ↓ 
Click Profile icon
  ↓ 
ProfessionalProfile page
```

#### Step 2: Open Incidents Tab
```
Click "Incidents" tab
  ↓
IncidentHistory loads
```

#### Step 3: Browse Incidents
```
List shows all reports:
- Incident category badge
- Severity badge (color-coded)
- Evidence photo indicator
- Red left border accent
- Submission date
```

#### Step 4: Expand Details
```
Click "Show Details"
  ↓
Card expands showing:
- Full incident description
- Evidence photo gallery
- Bus ID
- Severity level
- Report timestamp
- Status message
```

#### Step 5: View Evidence
```
Click photo thumbnail
  ↓
Opens full size in new tab
  ↓
Can save/download as needed
```

#### Step 6: Remove Report
```
Click trash icon
  ↓
Confirm deletion
  ↓
Report removed from history
```

---

## 🎨 UI Components Reference

### Feedback Component Colors
```
Categories:
- Driver Behavior: Blue background, blue text
- Cleanliness: Green background, green text
- Safety Equipment: Purple background, purple text
- Comfort: Yellow background, yellow text
- Timeliness: Orange background, orange text
- Other: Gray background, gray text

Rating:
- Stars: Amber when selected, gray when not
- Card: Gradient from amber-50 to orange-50
```

### Incident Component Colors
```
Categories:
- Unsafe Driving: Red badge
- Equipment Failure: Orange badge
- Accident: Rose badge
- Medical Emergency: Pink badge
- Harassment: Red badge
- Other: Yellow badge

Severity:
- Low: Yellow (🟡)
- Medium: Orange (🟠)
- High: Red (🔴)
- Critical: Rose/Deep Red (🔴)

Cards: Red left border accent
```

### Profile Component Colors
```
Header: Indigo → Purple → Pink gradient
Tabs: 
- Active: Indigo with light background
- Inactive: Gray text

Button: Indigo to purple gradient
Delete: Red text on hover
```

---

## 📸 Camera Usage

### Desktop/Laptop
```
"Take Photos Now" button
  ↓
Browser requests permission
  ↓
System camera selection (if multiple)
  ↓
Camera feed appears
  ↓
Click "Capture Photo"
  ↓
Photo saved to preview
  ↓
Click "Cancel" to close camera
```

### Mobile/Tablet
```
"Take Photos Now" button
  ↓
Device requests camera permission
  ↓
Camera opens in portrait mode
  ↓
Environment (rear) camera faces outward
  ↓
Full-screen camera view
  ↓
Tap "Capture Photo" button
  ↓
Photo added to preview
  ↓
Can take more or "Cancel"
```

### Camera Permissions
```
First time use:
- Browser asks permission
- User clicks "Allow" or "Deny"
- If denied, error message shown
- Can retry after enabling permissions

Subsequent uses:
- Camera opens immediately
- No permission prompt
```

---

## 📤 Photo Upload Process

### Upload Flow
```
User selects files
  ↓
Client preview generated (base64)
  ↓
Files shown in grid
  ↓
User clicks Submit
  ↓
Photos uploaded to Supabase storage:
  - One at a time
  - Public URLs generated
  - Names timestamped for uniqueness
  ↓
Database record created:
  - Stores first image URL
  - Stores metadata
  ↓
Success confirmation
```

### File Storage
```
Location: Supabase Storage buckets

Feedback bucket:
- feedback-${busId}-${timestamp}-${randomId}.jpg
- Example: feedback-123-1701234567890-a1b2c3d4.jpg

Incident bucket:
- incident-${busId}-${timestamp}-${randomId}.jpg
- Example: incident-123-1701234567890-xyz9876w.jpg

URLs: Publicly accessible
Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[filename]
```

---

## ✋ Error Handling

### Common Errors

#### "Unable to access camera"
```
Cause: Permission denied or no camera available
Solution:
1. Check browser permissions
2. Allow camera access when prompted
3. Check device has camera
4. Try different browser
5. Restart device
```

#### "Maximum 5 images allowed"
```
Cause: Tried to add more than 5 photos to feedback
Solution: Remove images before adding more
```

#### "Failed to submit feedback"
```
Cause: Network error or server issue
Solution:
1. Check internet connection
2. Wait and retry
3. Try with fewer/smaller images
4. Contact support if persists
```

#### "Please select an incident category"
```
Cause: Didn't select before submitting
Solution: Select a category from the list
```

#### "Please rate the driver"
```
Cause: Star rating was 0
Solution: Click on a star (1-5) to rate
```

---

## ✅ Best Practices

### Taking Photos
```
✓ Good lighting
✓ Clear view of incident/issue
✓ Multiple angles if possible
✓ Include context/surroundings
✓ Focus on relevant details
```

### Writing Descriptions
```
✓ Be specific and detailed
✓ Include date/time
✓ Describe what happened
✓ Note any injuries/damage
✓ List any witnesses
✓ Avoid personal attacks
✓ Stick to facts
```

### Feedback Tips
```
✓ Be constructive
✓ Mention positives and negatives
✓ Specific examples help
✓ Suggest improvements
✓ Be respectful to driver
✓ Rate honestly
```

---

## 🔒 Privacy & Safety

### Data Protection
```
✓ Photos encrypted in transit
✓ Stored securely in Supabase
✓ URLs are public but obscured
✓ User can delete anytime
✓ Account authentication required
```

### What Gets Stored
```
Stored permanently:
- Category selection
- Your description
- Star rating
- Photo URLs
- Timestamp

NOT stored:
- Device location
- Personal metadata
- Browsing history
- Device identifiers
```

### Deletion
```
You can delete:
✓ Individual feedback/incident records
✓ Photos (by deleting entire record)
✓ Account (contact support)

We cannot delete:
✗ Data once deleted is permanent
✗ No undelete available
✗ Archive copies may exist
```

---

## 📞 Need Help?

### In-App Help
```
Toast notifications explain errors
Empty states guide new users
Loading states show progress
Confirmations prevent accidental actions
```

### Visual Feedback
```
✓ Stars fill with color when rated
✓ Photos appear in preview grid
✓ Badges show selected category
✓ Card expands to show details
✓ Delete confirmation before removal
```

---

## 🎉 Summary

The feedback and incident system provides:
- 📸 Easy photo uploads and live capture
- ⭐ Simple star rating system
- 🎯 Clear categorization options
- 📋 Complete history tracking
- 🗑️ Delete/manage reports
- ✅ Professional user experience

Enjoy using the new features!
