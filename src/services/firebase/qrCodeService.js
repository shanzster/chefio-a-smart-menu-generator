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
  increment,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../config/firebase";

/**
 * Create a new QR code entry
 */
export const createQRCode = async (qrData) => {
  try {
    const qrCode = {
      ...qrData,
      createdAt: serverTimestamp(),
      scans: 0,
      feedbackCount: 0,
      isActive: true
    };

    const docRef = await addDoc(collection(db, "qrCodes"), qrCode);
    return { id: docRef.id, ...qrCode };
  } catch (error) {
    console.error("Error creating QR code:", error);
    throw error;
  }
};

/**
 * Get QR code by ID
 */
export const getQRCodeById = async (qrId) => {
  try {
    const docRef = doc(db, "qrCodes", qrId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting QR code:", error);
    throw error;
  }
};

/**
 * Get all QR codes for a cook
 */
export const getCookQRCodes = async (cookId) => {
  try {
    const q = query(
      collection(db, "qrCodes"),
      where("cookId", "==", cookId)
    );
    
    const querySnapshot = await getDocs(q);
    const qrCodes = [];
    
    querySnapshot.forEach((doc) => {
      qrCodes.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by createdAt on the client side
    qrCodes.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });
    
    return qrCodes;
  } catch (error) {
    console.error("Error getting cook QR codes:", error);
    throw error;
  }
};

/**
 * Increment scan count
 */
export const incrementScanCount = async (qrId) => {
  try {
    const docRef = doc(db, "qrCodes", qrId);
    await updateDoc(docRef, {
      scans: increment(1),
      lastScannedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error incrementing scan count:", error);
    throw error;
  }
};

/**
 * Increment feedback count
 */
export const incrementFeedbackCount = async (qrId) => {
  try {
    const docRef = doc(db, "qrCodes", qrId);
    await updateDoc(docRef, {
      feedbackCount: increment(1)
    });
  } catch (error) {
    console.error("Error incrementing feedback count:", error);
    throw error;
  }
};

/**
 * Save feedback for a QR code
 */
export const saveQRFeedback = async (qrId, feedbackData) => {
  try {
    const feedbackRef = collection(db, "qrCodes", qrId, "feedback");
    const feedback = {
      ...feedbackData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(feedbackRef, feedback);
    
    // Increment feedback count
    await incrementFeedbackCount(qrId);
    
    return { id: docRef.id, ...feedback };
  } catch (error) {
    console.error("Error saving feedback:", error);
    throw error;
  }
};

/**
 * Get all feedback for a QR code
 */
export const getQRFeedback = async (qrId) => {
  try {
    const feedbackRef = collection(db, "qrCodes", qrId, "feedback");
    const q = query(feedbackRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const feedback = [];
    querySnapshot.forEach((doc) => {
      feedback.push({ id: doc.id, ...doc.data() });
    });
    
    return feedback;
  } catch (error) {
    console.error("Error getting feedback:", error);
    throw error;
  }
};
