# Profile Feature Documentation

## Overview
The Profile section is a comprehensive user account management system that allows users to view and manage their personal information, contact details, security settings, and notification preferences. It follows professional SaaS application standards with a clean, intuitive interface.

## Features

### 1. **Personal Information Section**
- **Username**: Display and edit user's display name
- **Email Address**: View registered email (read-only for security)
- **Bio**: Add a personal bio or description
- Professional avatar with user initials
- Member since date display
- Verification and active status badges

### 2. **Contact Information Section**
- **Primary Contact**:
  - Phone number field
- **Address Information**:
  - Street address
  - City
  - State
  - ZIP code
- **Emergency Contact** (highlighted section):
  - Emergency contact person's name
  - Emergency contact phone number
  - Visually distinguished with warning-colored border

### 3. **Security Section**
- **Account Status Display**:
  - Current security status
  - Safe/Secure indicators
- **Change Password**:
  - Current password verification
  - New password field
  - Password confirmation field
  - Minimum 6 character requirement
  - Toggle password change interface
- **Session Information**:
  - Account status
  - Last login timestamp
  - Member since date
  - Current authentication details

### 4. **Notification Preferences Section**
- **Email Notifications**: Toggle email updates
- **Incident Alerts**: Toggle safety incident notifications
- **Safety Updates**: Toggle safety tips and updates
- **Weekly Report**: Toggle weekly incident summary
- Save preferences functionality
- Clear descriptions for each preference

### 5. **Profile Header**
- Large avatar display with gradient background
- User's display name
- Verification badges
- Member since information
- Edit Profile button for easy access to edit mode

## Technical Implementation

### File Structure
```
src/
├── pages/
│   └── Profile.tsx          # Main profile component
├── App.tsx                  # Updated with /profile route
├── pages/
│   └── Home.tsx             # Updated with profile link
```

### Route
- **Path**: `/profile`
- **Access**: Protected route (requires authentication)
- **Fallback**: Redirects to `/login` if not authenticated

### Dependencies Used
- React Hooks: `useState`, `useEffect`
- React Router: `useNavigate`
- Supabase Auth: User management and session handling
- UI Components: Cards, Inputs, Buttons, Badges, Tabs, Avatar
- Icons: Lucide React icons for visual indicators

### State Management
```typescript
// Profile Form Data
formData: {
  username: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  bio: string
  emergencyContact: string
  emergencyPhone: string
}

// Password Change Data
passwordData: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Notification Preferences
notifications: {
  emailNotifications: boolean
  incidentAlerts: boolean
  safetyUpdates: boolean
  weeklyReport: boolean
}
```

## User Workflows

### Editing Profile Information
1. User clicks "Edit Profile" button on the header
2. All input fields become editable
3. User makes changes to desired fields
4. User clicks "Save Changes" button
5. Changes are persisted to Supabase user metadata
6. Success toast notification appears
7. Edit mode closes automatically

### Changing Password
1. User navigates to Security tab
2. User clicks "Change Password" button
3. Password change form expands
4. User enters current password, new password, and confirmation
5. System validates:
   - Passwords match
   - New password is at least 6 characters
6. User clicks "Update Password"
7. Password is updated via Supabase
8. Success notification and form reset

### Managing Preferences
1. User navigates to Preferences tab
2. User toggles notification options as desired
3. User clicks "Save Preferences"
4. Success confirmation shown

## Styling Features

### Color Coding
- **Primary/Secondary/Accent**: Main profile information
- **Success Green**: Security status, verified badges
- **Warning Orange**: Emergency contact section
- **Destructive Red**: Logout/dangerous actions

### Responsive Design
- Mobile-first approach
- 1 column layout on mobile
- 2-3 column grid on medium+ screens
- Full width on large screens
- Touch-friendly button sizes (min 44px height)

### Visual Hierarchy
- Large header with gradient text
- Tab-based organization
- Card-based sections
- Icon indicators for quick recognition
- Badge components for status

## Security Considerations

1. **Email Address**: Read-only field (cannot be modified)
2. **Password Requirements**: 
   - Minimum 6 characters
   - Confirmation required
   - Current password validation
3. **Session Information**: Display-only (not editable)
4. **Supabase Integration**: All data changes go through secure Supabase API
5. **User Metadata**: Profile data stored in Supabase user metadata

## Error Handling

- Password mismatch validation
- Minimum password length check
- Empty field validation
- Toast notifications for all operations
- Try-catch error handling for API calls
- User-friendly error messages

## Future Enhancements

1. **Profile Picture Upload**: 
   - Image storage integration
   - Crop and resize functionality

2. **Two-Factor Authentication**:
   - SMS verification
   - Authenticator app support

3. **Activity Log**:
   - Login history
   - Account changes timeline

4. **Account Deletion**:
   - Secure deletion with confirmation
   - Data retention options

5. **Social Integrations**:
   - Link social media accounts
   - OAuth authentication options

6. **Preferences Export**:
   - Download account data (GDPR compliance)
   - Export settings as JSON

7. **Theme Preferences**:
   - Light/Dark mode toggle
   - Custom color preferences

## Usage Instructions for Users

### How to Access Profile
1. Click the "Profile" button in the home page navigation
2. Or navigate directly to `/profile` URL

### How to Edit Information
1. Click the "Edit Profile" button (pencil icon)
2. Modify the desired fields
3. Click "Save Changes" when done

### How to Change Password
1. Go to the Security tab
2. Click "Change Password"
3. Enter current password and new password twice
4. Click "Update Password"

### How to Manage Notifications
1. Go to the Preferences tab
2. Toggle the notification options you want
3. Click "Save Preferences"

### How to Logout
1. Click the "Logout" button at the bottom
2. Confirm logout
3. You'll be redirected to login page

## Testing Checklist

- [ ] Profile page loads correctly for authenticated users
- [ ] Profile page redirects unauthenticated users to login
- [ ] Edit mode toggles properly
- [ ] Form data saves to Supabase
- [ ] Password change validates correctly
- [ ] Password change updates in Supabase
- [ ] Notification preferences toggle
- [ ] Logout redirects to login page
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] All form validations work
- [ ] Toast notifications display correctly
- [ ] Loading states show appropriately
- [ ] Avatar displays with correct initials
- [ ] All tabs are accessible and functional
- [ ] Back button navigates to home

## API Integration

All operations integrate with Supabase:

### Update User Profile
```typescript
supabase.auth.updateUser({
  data: {
    username: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    bio: string
    emergencyContact: string
    emergencyPhone: string
  }
})
```

### Change Password
```typescript
supabase.auth.updateUser({
  password: string
})
```

### Get Session
```typescript
supabase.auth.getSession()
```

### Sign Out
```typescript
supabase.auth.signOut()
```
