import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

/**
 * Register a new user
 * Creates user in Firebase Auth and stores complete profile in Firestore
 */
export const registerUser = async (email, password, name, additionalData = {}) => {
  try {
    // Step 1: Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Update Firebase Auth profile with display name
    await updateProfile(user, { 
      displayName: name 
    });

    // Step 3: Create comprehensive user document in Firestore users collection
    const userData = {
      // Basic Info
      uid: user.uid,
      email: email,
      name: name,
      firstName: additionalData.firstName || '',
      middleName: additionalData.middleName || '',
      lastName: additionalData.lastName || '',
      birthdate: additionalData.birthdate || '',
      role: "cook",
      
      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      
      // Profile Info
      profile: {
        bio: "",
        avatar: "",
        phone: additionalData.phone || "",
        location: ""
      },
      
      // Address Info
      address: {
        street: additionalData.address || "",
        city: additionalData.city || "",
        country: additionalData.country || ""
      },
      
      // Statistics
      stats: {
        totalRecipes: 0,
        sharedRecipes: 0,
        weeklyRecipes: 0,
        totalViews: 0,
        totalSaves: 0,
        totalFeedback: 0,
        avgRating: 0
      },
      
      // Preferences
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        theme: "light",
        language: "en"
      },
      
      // Account Status
      status: {
        isActive: true,
        isVerified: false,
        isPremium: false
      }
    };

    await setDoc(doc(db, "users", user.uid), userData);

    console.log("✅ User registered successfully:", user.uid);

    // Return user data for immediate use
    return {
      uid: user.uid,
      email: user.email,
      name: name,
      role: "cook",
      stats: userData.stats,
      preferences: userData.preferences
    };
  } catch (error) {
    console.error("❌ Registration error:", error);
    
    // Provide user-friendly error messages
    let errorMessage = "Failed to create account. Please try again.";
    
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "This email is already registered. Please login instead.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address format.";
        break;
      case "auth/weak-password":
        errorMessage = "Password should be at least 6 characters.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection.";
        break;
      default:
        errorMessage = error.message || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Login user
 * Authenticates with Firebase Auth and retrieves user data from Firestore
 */
export const loginUser = async (email, password) => {
  try {
    // Step 1: Authenticate with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Step 3: Update last login timestamp
      await setDoc(doc(db, "users", user.uid), {
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log("✅ User logged in successfully:", user.uid);

      return {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        role: userData.role,
        stats: userData.stats,
        preferences: userData.preferences,
        profile: userData.profile
      };
    } else {
      // Fallback: Create user document if it doesn't exist
      console.warn("⚠️ User document not found, creating one...");
      
      const newUserData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "User",
        role: "cook",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        profile: { bio: "", avatar: "", phone: "", location: "" },
        stats: {
          totalRecipes: 0,
          sharedRecipes: 0,
          weeklyRecipes: 0,
          totalViews: 0,
          totalSaves: 0,
          totalFeedback: 0,
          avgRating: 0
        },
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
          theme: "light",
          language: "en"
        },
        status: {
          isActive: true,
          isVerified: false,
          isPremium: false
        }
      };
      
      await setDoc(doc(db, "users", user.uid), newUserData);
      
      return {
        uid: user.uid,
        email: user.email,
        name: newUserData.name,
        role: newUserData.role,
        stats: newUserData.stats,
        preferences: newUserData.preferences
      };
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    
    // Provide user-friendly error messages
    let errorMessage = "Failed to login. Please try again.";
    
    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "No account found with this email.";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password. Please try again.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address format.";
        break;
      case "auth/user-disabled":
        errorMessage = "This account has been disabled.";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many failed attempts. Please try again later.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection.";
        break;
      default:
        errorMessage = error.message || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        callback({
          uid: user.uid,
          email: user.email,
          displayName: userData.name || user.displayName,
          name: userData.name,
          role: userData.role,
          bio: userData.profile?.bio || '',
          location: userData.profile?.location || '',
          phone: userData.profile?.phone || '',
          createdAt: userData.createdAt,
          stats: userData.stats,
          preferences: userData.preferences
        });
      } else {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "User",
          name: user.displayName || "User",
          role: "cook"
        });
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Get current user data
 */
export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    return {
      uid: user.uid,
      email: user.email,
      ...userDoc.data()
    };
  }
  return null;
};

/**
 * Update user profile by userId (admin function)
 */
export const updateUserProfileById = async (userId, updates) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log("✅ User profile updated:", userId);
    return true;
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw error;
  }
};

/**
 * Update user stats
 */
export const updateUserStats = async (userId, stats) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      stats: stats,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log("✅ User stats updated:", userId);
    return true;
  } catch (error) {
    console.error("❌ Error updating stats:", error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("❌ Error getting user:", error);
    throw error;
  }
};

/**
 * Check if email exists
 */
export const checkEmailExists = async (email) => {
  try {
    // This will be handled by Firebase Auth during registration
    // Just a placeholder for future use
    return false;
  } catch (error) {
    console.error("❌ Error checking email:", error);
    return false;
  }
};

/**
 * Update user profile (for current logged-in user)
 */
export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Update Firebase Auth profile if displayName is provided
    if (updates.displayName) {
      await updateProfile(user, {
        displayName: updates.displayName
      });
    }

    // Update Firestore user document
    const userRef = doc(db, "users", user.uid);
    const updateData = {
      updatedAt: new Date().toISOString()
    };

    if (updates.displayName) updateData.name = updates.displayName;
    if (updates.bio !== undefined) updateData['profile.bio'] = updates.bio;
    if (updates.location !== undefined) updateData['profile.location'] = updates.location;
    if (updates.phone !== undefined) updateData['profile.phone'] = updates.phone;

    await setDoc(userRef, updateData, { merge: true });

    console.log("✅ User profile updated successfully");
    return true;
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw error;
  }
};

/**
 * Update user password
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('No user logged in');

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    console.log("✅ Password updated successfully");
    return true;
  } catch (error) {
    console.error("❌ Error updating password:", error);
    throw error;
  }
};

