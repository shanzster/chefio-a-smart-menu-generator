import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  role: null, // 'cook', 'guest', 'admin'
  isAuthenticated: false,
  
  login: (userData) => {
    set({
      user: userData,
      role: userData.role || 'cook',
      isAuthenticated: true,
    });
    // Store in localStorage for persistence
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify(userData));
  },
  
  logout: () => {
    set({
      user: null,
      role: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  initialize: () => {
    // Check localStorage on app load
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        set({
          user: userData,
          role: userData.role || 'cook',
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
  },
}));

// Named export for compatibility
export { useAuthStore };
export default useAuthStore;
