Firebase Auth Account Deletion Setup

OVERVIEW
When an admin deletes a user account, the system now deletes both the Firestore data and the Firebase Authentication account.

IMPLEMENTATION
1. Created Cloud Function: functions/deleteUserAccount
   - Verifies admin permissions
   - Deletes user from Firebase Authentication
   - Called from adminService.deleteUserAccount()

2. Updated adminService.js
   - Added Cloud Function call after Firestore deletion
   - Graceful error handling if auth deletion fails
   - Firestore data deletion completes regardless of auth deletion status

3. Updated firebase.js config
   - Added getFunctions() import and export
   - Functions now available for client-side calls

DEPLOYMENT STEPS
1. Install Firebase CLI if not already installed:
   npm install -g firebase-tools

2. Login to Firebase:
   firebase login

3. Deploy Cloud Functions:
   firebase deploy --only functions

4. Verify deployment:
   firebase functions:list

TESTING
1. Go to Admin > User Management
2. Click delete on any user
3. Verify user is deleted from:
   - Firestore (users collection)
   - Firebase Authentication (Firebase Console > Authentication)
   - All related data (recipes, feedback, tickets)

NOTES
- Cloud Function requires Firebase Admin SDK (automatically available in Cloud Functions)
- Function validates admin role before allowing deletion
- If auth deletion fails, Firestore data is still deleted (logged as warning)
- Requires Firebase project with Blaze plan (Cloud Functions require pay-as-you-go)
