# Profile Page Feature

## Overview
The Profile page allows users to view and edit their personal information, including profile picture, contact details, and bio.

## Features

### 1. Profile Picture Upload
- Users can upload a profile picture (max 5MB)
- Supported formats: All image types (jpg, png, gif, etc.)
- Images are stored in Firebase Storage under `profile-images/{userId}/`
- Automatic validation for file type and size

### 2. Editable Fields
- **Display Name**: User's full name
- **Email**: Read-only (cannot be changed)
- **Phone Number**: Contact number
- **Location**: City, Country
- **Bio**: Personal description (textarea)
- **Website**: Personal or professional website URL

### 3. Account Information
- Member since date
- Account status (Active)
- User role badge (Cook/Admin)

### 4. Edit Mode
- Toggle between view and edit modes
- Save changes to Firebase
- Cancel to revert changes
- Loading states for all async operations

## File Structure

```
src/
├── pages/
│   └── cook/
│       └── Profile/
│           └── Profile.jsx          # Main profile page component
├── services/
│   └── firebase/
│       └── userService.js           # Firebase user operations
└── App.jsx                          # Route added: /cook/profile
```

## Firebase Structure

### Firestore - users collection
```javascript
{
  uid: "user-id",
  displayName: "John Doe",
  email: "john@example.com",
  phoneNumber: "+1234567890",
  bio: "Passionate home cook...",
  location: "New York, USA",
  website: "https://johndoe.com",
  photoURL: "https://storage.googleapis.com/...",
  role: "cook",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Firebase Storage
```
profile-images/
  {userId}/
    profile_{userId}_{timestamp}.jpg
```

## API Functions

### userService.js

1. **updateUserProfile(userId, profileData)**
   - Updates user profile in Firestore
   - Returns: boolean (success)

2. **getUserProfile(userId)**
   - Fetches user profile from Firestore
   - Returns: user object or null

3. **uploadProfileImage(userId, file)**
   - Uploads image to Firebase Storage
   - Returns: download URL string

## Usage

### Navigation
- Accessible from sidebar: `/cook/profile`
- Icon: FiUser (User icon)
- Protected route (requires authentication)

### User Flow
1. User clicks "Profile" in sidebar
2. Views current profile information
3. Clicks "Edit Profile" button
4. Modifies desired fields
5. Optionally uploads new profile picture
6. Clicks "Save Changes" or "Cancel"
7. Changes are saved to Firebase and local state

## Validation

- Email format validation (regex)
- Image file type validation
- Image size validation (max 5MB)
- Required fields: Display Name

## Error Handling

- Toast notifications for success/error states
- Loading indicators during async operations
- Graceful fallbacks for missing data
- Try-catch blocks for all Firebase operations

## Future Enhancements

- Password change functionality
- Email verification status
- Two-factor authentication
- Account deletion
- Privacy settings
- Notification preferences
