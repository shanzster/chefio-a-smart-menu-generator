import { 
  collection, 
  doc, 
  getDoc,
  getDocs, 
  updateDoc,
  deleteDoc,
  query, 
  where, 
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
  writeBatch,
  setDoc
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { deleteUser, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../config/firebase";

/**
 * Check if user has admin role
 */
export const isAdmin = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === "admin" || userData.isAdmin === true;
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Get all support tickets (admin only)
 */
export const getAllTickets = async (filterStatus = null) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    let q;
    if (filterStatus) {
      q = query(
        collection(db, "tickets"),
        where("status", "==", filterStatus),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    }

    const ticketsSnapshot = await getDocs(q);
    const tickets = [];
    ticketsSnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });

    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

/**
 * Respond to support ticket (admin only)
 */
export const respondToTicket = async (ticketId, response) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    const ticketRef = doc(db, "tickets", ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      throw new Error("Ticket not found");
    }

    const currentData = ticketDoc.data();
    const responses = currentData.responses || [];

    responses.push({
      adminId: user.uid,
      adminName: user.displayName || "Admin",
      message: response.message,
      timestamp: serverTimestamp()
    });

    await updateDoc(ticketRef, {
      responses: responses,
      status: response.status || "in-progress",
      assignedTo: user.uid,
      updatedAt: serverTimestamp()
    });

    // Log admin action
    await logAdminAction({
      action: "ticket_response",
      targetType: "ticket",
      targetId: ticketId,
      details: { status: response.status }
    });

    return { id: ticketId, ...currentData, responses };
  } catch (error) {
    console.error("Error responding to ticket:", error);
    throw error;
  }
};

/**
 * Suspend/Unsuspend user (admin only)
 */
export const toggleUserSuspension = async (userId, suspend = true) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status: suspend ? "suspended" : "active",
      updatedAt: serverTimestamp()
    });

    // Log admin action
    await logAdminAction({
      action: suspend ? "user_suspended" : "user_unsuspended",
      targetType: "user",
      targetId: userId,
      details: { status: suspend ? "suspended" : "active" }
    });

    return true;
  } catch (error) {
    console.error("Error toggling user suspension:", error);
    throw error;
  }
};

/**
 * Delete user account (admin only)
 */
export const deleteUserAccount = async (userId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    const batch = writeBatch(db);

    // Delete user document
    batch.delete(doc(db, "users", userId));

    // Delete user's recipes
    const recipesQuery = query(
      collection(db, "recipes"),
      where("userId", "==", userId)
    );
    const recipesSnapshot = await getDocs(recipesQuery);
    recipesSnapshot.forEach((recipeDoc) => {
      batch.delete(doc(db, "recipes", recipeDoc.id));
    });

    // Delete user's feedback
    const feedbackQuery = query(
      collection(db, "feedback"),
      where("userId", "==", userId)
    );
    const feedbackSnapshot = await getDocs(feedbackQuery);
    feedbackSnapshot.forEach((feedbackDoc) => {
      batch.delete(doc(db, "feedback", feedbackDoc.id));
    });

    // Delete user's tickets
    const ticketsQuery = query(
      collection(db, "tickets"),
      where("userId", "==", userId)
    );
    const ticketsSnapshot = await getDocs(ticketsQuery);
    ticketsSnapshot.forEach((ticketDoc) => {
      batch.delete(doc(db, "tickets", ticketDoc.id));
    });

    await batch.commit();

    // Delete Firebase Auth account via Cloud Function
    try {
      const deleteUserAuthFunction = httpsCallable(functions, 'deleteUserAccount');
      await deleteUserAuthFunction({ userId });
    } catch (authError) {
      console.warn("Warning: Could not delete Firebase Auth account:", authError.message);
      // Continue even if auth deletion fails - Firestore data is already deleted
    }

    // Log admin action
    await logAdminAction({
      action: "user_deleted",
      targetType: "user",
      targetId: userId,
      details: { 
        recipesDeleted: recipesSnapshot.size,
        feedbackDeleted: feedbackSnapshot.size,
        ticketsDeleted: ticketsSnapshot.size
      }
    });

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

/**
 * Get flagged recipes (admin only)
 */
export const getFlaggedRecipes = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    const q = query(
      collection(db, "recipes"),
      where("flagged", "==", true),
      orderBy("flaggedAt", "desc")
    );

    const recipesSnapshot = await getDocs(q);
    const recipes = [];
    recipesSnapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() });
    });

    return recipes;
  } catch (error) {
    console.error("Error fetching flagged recipes:", error);
    throw error;
  }
};

/**
 * Moderate recipe (approve or delete)
 */
export const moderateRecipe = async (recipeId, action) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    const recipeRef = doc(db, "recipes", recipeId);

    if (action === "approve") {
      await updateDoc(recipeRef, {
        flagged: false,
        flaggedAt: null,
        flagReason: null,
        moderatedBy: user.uid,
        moderatedAt: serverTimestamp()
      });
    } else if (action === "delete") {
      await deleteDoc(recipeRef);
    }

    // Log admin action
    await logAdminAction({
      action: `recipe_${action}`,
      targetType: "recipe",
      targetId: recipeId,
      details: { action }
    });

    return true;
  } catch (error) {
    console.error("Error moderating recipe:", error);
    throw error;
  }
};

/**
 * Get system analytics (admin only)
 */
export const getSystemAnalytics = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    // Get total counts
    const usersSnapshot = await getDocs(collection(db, "users"));
    const recipesSnapshot = await getDocs(collection(db, "recipes"));
    const ticketsSnapshot = await getDocs(collection(db, "tickets"));

    // Count feedback from all sources
    let totalFeedback = 0;
    
    // Count feedback from main feedback collection (if exists)
    try {
      const feedbackSnapshot = await getDocs(collection(db, "feedback"));
      totalFeedback += feedbackSnapshot.size;
    } catch (error) {
      console.log('No main feedback collection');
    }

    // Count feedback from QR codes subcollections
    try {
      const qrCodesSnapshot = await getDocs(collection(db, "qrCodes"));
      for (const qrDoc of qrCodesSnapshot.docs) {
        const qrFeedbackRef = collection(db, "qrCodes", qrDoc.id, "feedback");
        const qrFeedbackSnapshot = await getDocs(qrFeedbackRef);
        totalFeedback += qrFeedbackSnapshot.size;
      }
    } catch (error) {
      console.log('Error counting QR feedback:', error);
    }

    // Count feedback from recipes subcollections
    try {
      for (const recipeDoc of recipesSnapshot.docs) {
        const recipeFeedbackRef = collection(db, "recipes", recipeDoc.id, "feedback");
        const recipeFeedbackSnapshot = await getDocs(recipeFeedbackRef);
        totalFeedback += recipeFeedbackSnapshot.size;
      }
    } catch (error) {
      console.log('Error counting recipe feedback:', error);
    }

    // Get active tickets
    const openTicketsQuery = query(
      collection(db, "tickets"),
      where("status", "==", "open")
    );
    const openTicketsSnapshot = await getDocs(openTicketsQuery);

    // Get flagged content
    const flaggedQuery = query(
      collection(db, "recipes"),
      where("flagged", "==", true)
    );
    const flaggedSnapshot = await getDocs(flaggedQuery);

    return {
      totalUsers: usersSnapshot.size,
      totalRecipes: recipesSnapshot.size,
      totalFeedback: totalFeedback,
      totalTickets: ticketsSnapshot.size,
      openTickets: openTicketsSnapshot.size,
      flaggedRecipes: flaggedSnapshot.size,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

/**
 * Log admin action
 */
const logAdminAction = async (actionData) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "admin_logs"), {
      adminId: user.uid,
      adminName: user.displayName || "Admin",
      action: actionData.action,
      targetType: actionData.targetType,
      targetId: actionData.targetId,
      details: actionData.details || {},
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error logging admin action:", error);
    // Don't throw - logging failure shouldn't stop the main action
  }
};

/**
 * Get admin logs
 */
export const getAdminLogs = async (limitCount = 100) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    const q = query(
      collection(db, "admin_logs"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const logsSnapshot = await getDocs(q);
    const logs = [];
    logsSnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });

    return logs;
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    throw error;
  }
};

/**
 * Update user role to admin
 */
export const makeUserAdmin = async (userId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: "admin",
      isAdmin: true,
      updatedAt: serverTimestamp()
    });

    // Log admin action
    await logAdminAction({
      action: "user_promoted_to_admin",
      targetType: "user",
      targetId: userId,
      details: { role: "admin" }
    });

    return true;
  } catch (error) {
    console.error("Error making user admin:", error);
    throw error;
  }
};

/**
 * Send password reset email to user
 */
export const sendPasswordResetToUser = async (email) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    await sendPasswordResetEmail(auth, email);

    // Log admin action
    await logAdminAction({
      action: "password_reset_sent",
      targetType: "user",
      targetId: email,
      details: { email }
    });

    return true;
  } catch (error) {
    console.error("Error sending password reset:", error);
    throw error;
  }
};

/**
 * Create new user (admin only)
 */
export const createUser = async (userData) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(currentUser.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const newUser = userCredential.user;

    // Update display name
    await updateProfile(newUser, {
      displayName: userData.displayName
    });

    // Create user document in Firestore
    await setDoc(doc(db, "users", newUser.uid), {
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role || "user",
      isAdmin: userData.role === "admin",
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Log admin action
    await logAdminAction({
      action: "user_created",
      targetType: "user",
      targetId: newUser.uid,
      details: { email: userData.email, role: userData.role || "user" }
    });

    // Re-authenticate as admin
    // Note: Creating a user logs you in as that user, so we need to handle this
    // In a production app, you'd use Firebase Admin SDK on the backend

    return { id: newUser.uid, ...userData };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Update user information (admin only)
 */
export const updateUser = async (userId, updates) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    // Log admin action
    await logAdminAction({
      action: "user_updated",
      targetType: "user",
      targetId: userId,
      details: updates
    });

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * Get all feedback from the system (admin only)
 * Includes feedback from recipes and QR codes
 */
export const getAllFeedback = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    console.log('🔍 [ADMIN] Fetching all feedback...');
    const allFeedback = [];

    // Get feedback from main feedback collection
    try {
      console.log('📋 [ADMIN] Fetching main feedback collection...');
      const feedbackQuery = query(
        collection(db, "feedback"),
        orderBy("createdAt", "desc")
      );
      const feedbackSnapshot = await getDocs(feedbackQuery);
      console.log(`✅ [ADMIN] Found ${feedbackSnapshot.size} items in main feedback collection`);
      
      feedbackSnapshot.forEach((doc) => {
        allFeedback.push({
          id: doc.id,
          ...doc.data(),
          source: 'recipe',
          collectionPath: 'feedback'
        });
      });
    } catch (error) {
      console.error('❌ [ADMIN] Error fetching main feedback:', error);
    }

    // Get all recipes to fetch their subcollection feedback
    try {
      console.log('📋 [ADMIN] Fetching recipe feedback...');
      const recipesSnapshot = await getDocs(collection(db, "recipes"));
      console.log(`✅ [ADMIN] Found ${recipesSnapshot.size} recipes`);
      
      for (const recipeDoc of recipesSnapshot.docs) {
        try {
          const recipeFeedbackRef = collection(db, "recipes", recipeDoc.id, "feedback");
          const recipeFeedbackSnapshot = await getDocs(recipeFeedbackRef);
          
          recipeFeedbackSnapshot.forEach((feedbackDoc) => {
            allFeedback.push({
              id: feedbackDoc.id,
              ...feedbackDoc.data(),
              recipeId: recipeDoc.id,
              recipeName: recipeDoc.data().title || recipeDoc.data().name || 'Unknown Recipe',
              source: 'recipe_subcollection',
              collectionPath: `recipes/${recipeDoc.id}/feedback`
            });
          });
        } catch (error) {
          console.error(`❌ [ADMIN] Error fetching feedback for recipe ${recipeDoc.id}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ [ADMIN] Error fetching recipes:', error);
    }

    // Get all QR codes to fetch their feedback
    try {
      console.log('📋 [ADMIN] Fetching QR code feedback...');
      const qrCodesSnapshot = await getDocs(collection(db, "qrCodes"));
      console.log(`✅ [ADMIN] Found ${qrCodesSnapshot.size} QR codes`);
      
      for (const qrDoc of qrCodesSnapshot.docs) {
        try {
          const qrFeedbackRef = collection(db, "qrCodes", qrDoc.id, "feedback");
          const qrFeedbackSnapshot = await getDocs(qrFeedbackRef);
          
          qrFeedbackSnapshot.forEach((feedbackDoc) => {
            allFeedback.push({
              id: feedbackDoc.id,
              ...feedbackDoc.data(),
              qrCodeId: qrDoc.id,
              recipeName: qrDoc.data().recipeName || 'QR Code Recipe',
              source: 'qr_code',
              collectionPath: `qrCodes/${qrDoc.id}/feedback`
            });
          });
        } catch (error) {
          console.error(`❌ [ADMIN] Error fetching feedback for QR code ${qrDoc.id}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ [ADMIN] Error fetching QR codes:', error);
    }

    // Sort all feedback by creation date (newest first)
    allFeedback.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    console.log(`✅ [ADMIN] Total feedback collected: ${allFeedback.length}`);
    return allFeedback;
  } catch (error) {
    console.error("❌ [ADMIN] Error getting all feedback:", error);
    throw error;
  }
};

/**
 * Delete feedback (admin only)
 * Handles feedback from different collections
 */
export const deleteFeedback = async (feedbackId, collectionPath) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    // Delete from the appropriate collection
    if (collectionPath.includes('/')) {
      // Subcollection path (e.g., "recipes/abc123/feedback")
      const pathParts = collectionPath.split('/');
      const feedbackRef = doc(db, pathParts[0], pathParts[1], pathParts[2], feedbackId);
      await deleteDoc(feedbackRef);
    } else {
      // Main collection
      await deleteDoc(doc(db, collectionPath, feedbackId));
    }

    // Log admin action
    await logAdminAction({
      action: "feedback_deleted",
      targetType: "feedback",
      targetId: feedbackId,
      details: { collectionPath }
    });

    return true;
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
};

/**
 * Bulk delete feedback (admin only)
 */
export const bulkDeleteFeedback = async (feedbackItems) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    const batch = writeBatch(db);
    
    feedbackItems.forEach(item => {
      if (item.collectionPath.includes('/')) {
        const pathParts = item.collectionPath.split('/');
        const feedbackRef = doc(db, pathParts[0], pathParts[1], pathParts[2], item.id);
        batch.delete(feedbackRef);
      } else {
        batch.delete(doc(db, item.collectionPath, item.id));
      }
    });

    await batch.commit();

    // Log admin action
    await logAdminAction({
      action: "feedback_bulk_deleted",
      targetType: "feedback",
      details: { count: feedbackItems.length }
    });

    return true;
  } catch (error) {
    console.error("Error bulk deleting feedback:", error);
    throw error;
  }
};

/**
 * Delete a single admin log
 */
export const deleteAdminLog = async (logId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    await deleteDoc(doc(db, "admin_logs", logId));
    return true;
  } catch (error) {
    console.error("Error deleting admin log:", error);
    throw error;
  }
};

/**
 * Clear old admin logs (older than specified days)
 */
export const clearOldAdminLogs = async (daysOld = 30) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error("Unauthorized: Admin access required");

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const q = query(
      collection(db, "admin_logs"),
      where("timestamp", "<", cutoffDate)
    );

    const logsSnapshot = await getDocs(q);
    const batch = writeBatch(db);

    logsSnapshot.forEach((logDoc) => {
      batch.delete(doc(db, "admin_logs", logDoc.id));
    });

    await batch.commit();

    // Log this action
    await logAdminAction({
      action: "logs_cleared",
      targetType: "admin_logs",
      details: { daysOld, count: logsSnapshot.size }
    });

    return logsSnapshot.size;
  } catch (error) {
    console.error("Error clearing old logs:", error);
    throw error;
  }
};

export default {
  isAdmin,
  getAllUsers,
  getAllTickets,
  respondToTicket,
  toggleUserSuspension,
  deleteUserAccount,
  getFlaggedRecipes,
  moderateRecipe,
  getSystemAnalytics,
  getAdminLogs,
  makeUserAdmin,
  sendPasswordResetToUser,
  createUser,
  updateUser,
  getAllFeedback,
  deleteFeedback,
  bulkDeleteFeedback,
  deleteAdminLog,
  clearOldAdminLogs
};
