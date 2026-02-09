import { create } from 'zustand';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  onAuthChange 
} from '../services/firebase/authService';

const useAuthStore = create((set, get) => ({
  user: null,
  role: null, // 'cook', 'guest', 'admin'
  isAuthenticated: false,
  loading: false,
  error: null,
  
  // Login with Firebase
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userData = await loginUser(email, password);
      set({ 
        user: userData,
        role: userData.role || 'cook',
        isAuthenticated: true,
        loading: false 
      });
      return userData;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Register with Firebase
  register: async (email, password, name, additionalData = {}) => {
    set({ loading: true, error: null });
    try {
      const userData = await registerUser(email, password, name, additionalData);
      set({ 
        user: userData,
        role: userData.role || 'cook',
        isAuthenticated: true,
        loading: false 
      });
      return userData;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  // Logout from Firebase
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await logoutUser();
      set({
        user: null,
        role: null,
        isAuthenticated: false,
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Set user (used by auth listener)
  setUser: (userData) => {
    if (userData) {
      set({ 
        user: userData, 
        role: userData.role || 'cook',
        isAuthenticated: true 
      });
    } else {
      set({ 
        user: null, 
        role: null,
        isAuthenticated: false 
      });
    }
  },
  
  // Initialize auth listener
  initialize: () => {
    const unsubscribe = onAuthChange((userData) => {
      get().setUser(userData);
    });
    return unsubscribe;
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

// Named export for compatibility
export { useAuthStore };
export default useAuthStore;
