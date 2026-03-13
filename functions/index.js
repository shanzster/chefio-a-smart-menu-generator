const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
  // Verify the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId } = data;

  if (!userId) {
    throw new functions.https.HttpsError('invalid-argument', 'userId is required');
  }

  try {
    // Verify the caller is an admin
    const callerDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can delete users');
    }

    // Delete the user from Firebase Authentication
    await admin.auth().deleteUser(userId);

    return { success: true, message: 'User deleted from Firebase Auth' };
  } catch (error) {
    console.error('Error deleting user from Firebase Auth:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
