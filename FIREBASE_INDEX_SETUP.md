# Firebase Firestore Index Setup

## Issue
The "My Recipes" page requires a composite index on the `recipes` collection to query recipes by `userId` and `createdAt`.

## Error Message
```
FirebaseError: The query requires an index. You can create it here: [URL]
```

## Quick Fix - Option 1: Click the Link
1. **Click the URL in the error message** - Firebase provides a direct link in the console error
2. This will open Firebase Console with the index pre-configured
3. Click "Create Index"
4. Wait 2-5 minutes for the index to build
5. Refresh your "My Recipes" page

## Option 2: Manual Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `chefio-22d95`
3. Navigate to **Firestore Database** → **Indexes** tab
4. Click **"Create Index"**
5. Configure the index:
   - **Collection ID**: `recipes`
   - **Fields to index**:
     - Field: `userId` | Order: Ascending
     - Field: `createdAt` | Order: Descending
6. Click **"Create"**
7. Wait for the index to build (usually 2-5 minutes)

## Option 3: Using Firebase CLI
If you have Firebase CLI installed, you can deploy the indexes automatically:

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore in your project (if not done)
firebase init firestore

# Deploy the indexes
firebase deploy --only firestore:indexes
```

The `firestore.indexes.json` file has been created in your project root with the required indexes.

## Required Indexes

### Index 1: User Recipes Query
- **Collection**: `recipes`
- **Fields**:
  - `userId` (Ascending)
  - `createdAt` (Descending)
- **Purpose**: Fetch user's recipes sorted by creation date

### Index 2: Favorite Recipes Query
- **Collection**: `recipes`
- **Fields**:
  - `userId` (Ascending)
  - `isFavorite` (Ascending)
  - `updatedAt` (Descending)
- **Purpose**: Fetch user's favorite recipes sorted by update date

## Verify Index Creation
After creating the index:
1. Go to Firebase Console → Firestore → Indexes
2. Check that the index status shows **"Enabled"** (not "Building")
3. Refresh your "My Recipes" page
4. Recipes should now load without errors

## Notes
- Index creation is a **one-time setup** per Firebase project
- Once created, the index works for all users
- Building time depends on existing data (usually 2-5 minutes for new projects)
- You may need to create indexes for other queries as your app grows
