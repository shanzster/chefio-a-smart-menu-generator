import { 
  collection, 
  doc, 
  addDoc, 
  getDoc,
  getDocs, 
  updateDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  arrayUnion
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";

/**
 * Create a new support ticket
 */
export const createTicket = async (ticketData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const ticket = {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || "User",
      category: ticketData.category,
      subject: ticketData.subject,
      description: ticketData.description,
      priority: ticketData.priority || "medium",
      status: "open",
      responses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "tickets"), ticket);
    
    // Generate ticket ID
    const ticketId = `TKT-${String(docRef.id).slice(-6).toUpperCase()}`;
    await updateDoc(docRef, { ticketId });

    return { id: docRef.id, ticketId, ...ticket };
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

/**
 * Get user's tickets
 */
export const getUserTickets = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "tickets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const tickets = [];
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });

    return tickets;
  } catch (error) {
    console.error("Error getting tickets:", error);
    throw error;
  }
};

/**
 * Get a single ticket by ID
 */
export const getTicketById = async (ticketId) => {
  try {
    const docRef = doc(db, "tickets", ticketId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Ticket not found");
    }
  } catch (error) {
    console.error("Error getting ticket:", error);
    throw error;
  }
};

/**
 * Add a response to a ticket
 */
export const addTicketResponse = async (ticketId, message, isSupport = false) => {
  try {
    const user = auth.currentUser;
    if (!user && !isSupport) throw new Error("User not authenticated");

    const response = {
      id: Date.now(),
      from: isSupport ? "Support Team" : user.displayName || "User",
      message: message,
      timestamp: new Date().toISOString(),
      isSupport: isSupport
    };

    const docRef = doc(db, "tickets", ticketId);
    await updateDoc(docRef, {
      responses: arrayUnion(response),
      updatedAt: serverTimestamp()
    });

    return response;
  } catch (error) {
    console.error("Error adding response:", error);
    throw error;
  }
};

/**
 * Update ticket status
 */
export const updateTicketStatus = async (ticketId, status) => {
  try {
    const docRef = doc(db, "tickets", ticketId);
    await updateDoc(docRef, {
      status: status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
};

/**
 * Update ticket priority
 */
export const updateTicketPriority = async (ticketId, priority) => {
  try {
    const docRef = doc(db, "tickets", ticketId);
    await updateDoc(docRef, {
      priority: priority,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating ticket priority:", error);
    throw error;
  }
};

/**
 * Get ticket statistics
 */
export const getTicketStats = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const tickets = await getUserTickets();

    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === "open").length,
      inProgress: tickets.filter(t => t.status === "in-progress").length,
      resolved: tickets.filter(t => t.status === "resolved").length,
      byPriority: {
        high: tickets.filter(t => t.priority === "high").length,
        medium: tickets.filter(t => t.priority === "medium").length,
        low: tickets.filter(t => t.priority === "low").length
      }
    };

    return stats;
  } catch (error) {
    console.error("Error getting ticket stats:", error);
    throw error;
  }
};

/**
 * Close a ticket
 */
export const closeTicket = async (ticketId) => {
  try {
    await updateTicketStatus(ticketId, "resolved");
  } catch (error) {
    console.error("Error closing ticket:", error);
    throw error;
  }
};

/**
 * Reopen a ticket
 */
export const reopenTicket = async (ticketId) => {
  try {
    await updateTicketStatus(ticketId, "open");
  } catch (error) {
    console.error("Error reopening ticket:", error);
    throw error;
  }
};
