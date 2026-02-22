import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../config/firebase";

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Upload profile image to Firebase Storage
 */
export const uploadProfileImage = async (userId, file) => {
  try {
    // Create a reference to the file location
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${userId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profile-images/${userId}/${fileName}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

/**
 * Update user password
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    // This would typically involve Firebase Auth methods
    // For now, we'll just throw an error to implement later
    throw new Error("Password update not implemented yet");
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};
