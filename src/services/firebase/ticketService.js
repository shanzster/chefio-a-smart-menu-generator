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
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../config/firebase";

/**
 * Create a new support ticket
 */
export const createTicket = async (ticketData) => {
  try {
    const ticket = {
      ...ticketData,
      status: 'open',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      responseCount: 0
    };

    const docRef = await addDoc(collection(db, "tickets"), ticket);
    return { id: docRef.id, ...ticket };
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

/**
 * Get ticket by ID
 */
export const getTicketById = async (ticketId) => {
  try {
    const docRef = doc(db, "tickets", ticketId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting ticket:", error);
    throw error;
  }
};

/**
 * Get all tickets for a user
 */
export const getUserTickets = async (userId) => {
  try {
    const q = query(
      collection(db, "tickets"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const tickets = [];
    
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by updatedAt on the client side (most recent first)
    tickets.sort((a, b) => {
      const dateA = a.updatedAt?.seconds || 0;
      const dateB = b.updatedAt?.seconds || 0;
      return dateB - dateA;
    });
    
    return tickets;
  } catch (error) {
    console.error("Error getting user tickets:", error);
    throw error;
  }
};

/**
 * Get all tickets (for admin)
 */
export const getAllTickets = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "tickets"));
    const tickets = [];
    
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by updatedAt on the client side (most recent first)
    tickets.sort((a, b) => {
      const dateA = a.updatedAt?.seconds || 0;
      const dateB = b.updatedAt?.seconds || 0;
      return dateB - dateA;
    });
    
    return tickets;
  } catch (error) {
    console.error("Error getting all tickets:", error);
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
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
};

/**
 * Add a response to a ticket
 */
export const addTicketResponse = async (ticketId, responseData) => {
  try {
    const responseRef = collection(db, "tickets", ticketId, "responses");
    const response = {
      ...responseData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(responseRef, response);
    
    // Update ticket's updatedAt and responseCount
    const ticketRef = doc(db, "tickets", ticketId);
    await updateDoc(ticketRef, {
      updatedAt: serverTimestamp(),
      responseCount: (await getDoc(ticketRef)).data().responseCount + 1
    });
    
    return { id: docRef.id, ...response };
  } catch (error) {
    console.error("Error adding ticket response:", error);
    throw error;
  }
};

/**
 * Get all responses for a ticket
 */
export const getTicketResponses = async (ticketId) => {
  try {
    const responseRef = collection(db, "tickets", ticketId, "responses");
    const q = query(responseRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    
    const responses = [];
    querySnapshot.forEach((doc) => {
      responses.push({ id: doc.id, ...doc.data() });
    });
    
    return responses;
  } catch (error) {
    console.error("Error getting ticket responses:", error);
    throw error;
  }
};
