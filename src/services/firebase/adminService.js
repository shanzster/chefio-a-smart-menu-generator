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
  writeBatch
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { deleteUser } from "firebase/auth";

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
    const feedbackSnapshot = await getDocs(collection(db, "feedback"));
    const ticketsSnapshot = await getDocs(collection(db, "tickets"));

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
      totalFeedback: feedbackSnapshot.size,
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
  makeUserAdmin
};
