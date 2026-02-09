import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFZEBnSQLqcnx6nfdd85aXgoce6Mge2as",
  authDomain: "chefio-22d95.firebaseapp.com",
  projectId: "chefio-22d95",
  storageBucket: "chefio-22d95.firebasestorage.app",
  messagingSenderId: "570114622034",
  appId: "1:570114622034:web:309ed99b6c5cba9ad1558b",
  measurementId: "G-82FWE6M70T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
