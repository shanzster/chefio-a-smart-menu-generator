import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";

/**
 * Submit feedback for a recipe
 */
export const submitFeedback = async (recipeId, feedbackData) => {
  try {
    const user = auth.currentUser;
    
    const feedback = {
      recipeId,
      userId: user?.uid || "anonymous",
      userName: user?.displayName || feedbackData.userName || "Anonymous",
      rating: feedbackData.rating,
      comment: feedbackData.comment,
      helpful: 0,
      notHelpful: 0,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "feedback"), feedback);
    
    // Update recipe's average rating
    await updateRecipeRating(recipeId);
    
    return { id: docRef.id, ...feedback };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

/**
 * Get feedback for a recipe
 */
export const getRecipeFeedback = async (recipeId) => {
  try {
    const q = query(
      collection(db, "feedback"),
      where("recipeId", "==", recipeId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const feedbacks = [];
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() });
    });

    return feedbacks;
  } catch (error) {
    console.error("Error getting feedback:", error);
    throw error;
  }
};

/**
 * Get all feedback for user's recipes
 */
export const getUserRecipesFeedback = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // First get user's recipes
    const recipesQuery = query(
      collection(db, "recipes"),
      where("userId", "==", user.uid)
    );
    const recipesSnapshot = await getDocs(recipesQuery);
    const recipeIds = [];
    recipesSnapshot.forEach((doc) => {
      recipeIds.push(doc.id);
    });

    if (recipeIds.length === 0) return [];

    // Get feedback for all user's recipes
    const feedbackQuery = query(
      collection(db, "feedback"),
      where("recipeId", "in", recipeIds),
      orderBy("createdAt", "desc")
    );

    const feedbackSnapshot = await getDocs(feedbackQuery);
    const feedbacks = [];
    feedbackSnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() });
    });

    return feedbacks;
  } catch (error) {
    console.error("Error getting user recipes feedback:", error);
    throw error;
  }
};

/**
 * Mark feedback as helpful
 */
export const markFeedbackHelpful = async (feedbackId, isHelpful = true) => {
  try {
    const docRef = doc(db, "feedback", feedbackId);
    
    if (isHelpful) {
      await updateDoc(docRef, {
        helpful: increment(1)
      });
    } else {
      await updateDoc(docRef, {
        notHelpful: increment(1)
      });
    }
  } catch (error) {
    console.error("Error marking feedback helpful:", error);
    throw error;
  }
};

/**
 * Update recipe's average rating
 */
const updateRecipeRating = async (recipeId) => {
  try {
    const feedbacks = await getRecipeFeedback(recipeId);
    
    if (feedbacks.length === 0) return;

    const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    const avgRating = totalRating / feedbacks.length;

    const recipeRef = doc(db, "recipes", recipeId);
    await updateDoc(recipeRef, {
      avgRating: avgRating,
      totalFeedback: feedbacks.length
    });
  } catch (error) {
    console.error("Error updating recipe rating:", error);
    throw error;
  }
};

/**
 * Get feedback statistics for a recipe
 */
export const getFeedbackStats = async (recipeId) => {
  try {
    const feedbacks = await getRecipeFeedback(recipeId);
    
    const stats = {
      total: feedbacks.length,
      avgRating: 0,
      ratings: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }
    };

    if (feedbacks.length > 0) {
      const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
      stats.avgRating = totalRating / feedbacks.length;

      feedbacks.forEach(fb => {
        stats.ratings[fb.rating]++;
      });
    }

    return stats;
  } catch (error) {
    console.error("Error getting feedback stats:", error);
    throw error;
  }
};
