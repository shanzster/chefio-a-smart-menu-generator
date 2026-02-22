import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  setDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";

/**
 * Create a new recipe
 */
export const createRecipe = async (recipeData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const recipe = {
      ...recipeData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isFavorite: false,
      views: 0,
      saves: 0,
      shares: 0
    };

    const docRef = await addDoc(collection(db, "recipes"), recipe);
    return { id: docRef.id, ...recipe };
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};

/**
 * Get user's recipes
 */
export const getUserRecipes = async (userId = null) => {
  try {
    const user = auth.currentUser;
    const targetUserId = userId || user?.uid;
    
    if (!targetUserId) throw new Error("User not authenticated");

    const q = query(
      collection(db, "recipes"),
      where("userId", "==", targetUserId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const recipes = [];
    querySnapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() });
    });

    return recipes;
  } catch (error) {
    console.error("Error getting recipes:", error);
    throw error;
  }
};

/**
 * Get a single recipe by ID
 */
export const getRecipeById = async (recipeId) => {
  try {
    const docRef = doc(db, "recipes", recipeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting recipe:", error);
    throw error;
  }
};

/**
 * Update a recipe
 */
export const updateRecipe = async (recipeId, updates) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "recipes", recipeId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return { id: recipeId, ...updates };
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

/**
 * Delete a recipe
 */
export const deleteRecipe = async (recipeId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    await deleteDoc(doc(db, "recipes", recipeId));
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (recipeId, currentStatus) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "recipes", recipeId);
    await updateDoc(docRef, {
      isFavorite: !currentStatus,
      updatedAt: serverTimestamp()
    });

    return !currentStatus;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

/**
 * Search recipes
 */
export const searchRecipes = async (searchTerm, category = null) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    let q = query(
      collection(db, "recipes"),
      where("userId", "==", user.uid)
    );

    if (category && category !== "All") {
      q = query(q, where("category", "==", category));
    }

    const querySnapshot = await getDocs(q);
    const recipes = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Client-side filtering for search term
      if (searchTerm === "" || 
          data.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        recipes.push({ id: doc.id, ...data });
      }
    });

    return recipes;
  } catch (error) {
    console.error("Error searching recipes:", error);
    throw error;
  }
};

/**
 * Get favorite recipes
 */
export const getFavoriteRecipes = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "recipes"),
      where("userId", "==", user.uid),
      where("isFavorite", "==", true),
      orderBy("updatedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const recipes = [];
    querySnapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() });
    });

    return recipes;
  } catch (error) {
    console.error("Error getting favorite recipes:", error);
    throw error;
  }
};

/**
 * Increment recipe views
 */
export const incrementViews = async (recipeId) => {
  try {
    const docRef = doc(db, "recipes", recipeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0;
      await updateDoc(docRef, {
        views: currentViews + 1
      });
    }
  } catch (error) {
    console.error("Error incrementing views:", error);
    throw error;
  }
};

/**
 * Increment recipe saves
 */
export const incrementSaves = async (recipeId) => {
  try {
    const docRef = doc(db, "recipes", recipeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentSaves = docSnap.data().saves || 0;
      await updateDoc(docRef, {
        saves: currentSaves + 1
      });
    }
  } catch (error) {
    console.error("Error incrementing saves:", error);
    throw error;
  }
};

/**
 * Save a recipe to user's saved recipes (stored in user document)
 */
export const saveRecipeToUser = async (recipe) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    // Get current saved recipes or initialize empty object
    const currentData = userDoc.exists() ? userDoc.data() : {};
    const savedRecipes = currentData.savedRecipes || {};
    
    // Check if recipe already saved
    if (savedRecipes[recipe.id]) {
      throw new Error("Recipe already saved!");
    }
    
    // Add recipe with metadata
    savedRecipes[recipe.id] = {
      ...recipe,
      savedAt: new Date().toISOString(),
      isFavorite: false
    };
    
    // Update user document
    await setDoc(userDocRef, {
      ...currentData,
      savedRecipes,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return savedRecipes[recipe.id];
  } catch (error) {
    console.error("Error saving recipe to user:", error);
    throw error;
  }
};

/**
 * Get user's saved recipes from their user document
 */
export const getUserSavedRecipes = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return [];
    }
    
    const savedRecipes = userDoc.data().savedRecipes || {};
    
    // Convert map to array and sort by savedAt
    const recipesArray = Object.entries(savedRecipes).map(([id, recipe]) => ({
      ...recipe,
      id
    }));
    
    // Sort by savedAt (most recent first)
    recipesArray.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    
    return recipesArray;
  } catch (error) {
    console.error("Error getting saved recipes:", error);
    throw error;
  }
};

/**
 * Remove a saved recipe from user's document
 */
export const removeSavedRecipe = async (recipeId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }
    
    const savedRecipes = userDoc.data().savedRecipes || {};
    
    // Remove the recipe
    delete savedRecipes[recipeId];
    
    // Update user document
    await updateDoc(userDocRef, {
      savedRecipes,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error removing saved recipe:", error);
    throw error;
  }
};

/**
 * Toggle favorite status for a saved recipe
 */
export const toggleSavedRecipeFavorite = async (recipeId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }
    
    const savedRecipes = userDoc.data().savedRecipes || {};
    
    if (!savedRecipes[recipeId]) {
      throw new Error("Recipe not found in saved recipes");
    }
    
    // Toggle favorite
    savedRecipes[recipeId].isFavorite = !savedRecipes[recipeId].isFavorite;
    
    // Update user document
    await updateDoc(userDocRef, {
      savedRecipes,
      updatedAt: serverTimestamp()
    });
    
    return savedRecipes[recipeId].isFavorite;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};




/**
 * Save feedback for a recipe
 */
export const saveFeedback = async (recipeId, feedbackData) => {
  try {
    const feedbackRef = collection(db, "recipes", recipeId, "feedback");
    const feedback = {
      ...feedbackData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(feedbackRef, feedback);
    return { id: docRef.id, ...feedback };
  } catch (error) {
    console.error("Error saving feedback:", error);
    throw error;
  }
};

/**
 * Get all feedback for a recipe
 */
export const getRecipeFeedback = async (recipeId) => {
  try {
    const feedbackRef = collection(db, "recipes", recipeId, "feedback");
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
