import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../config/firebase';

/**
 * Debug component to check and clear auth state
 * Only visible in development mode
 * Add to any page: <AuthDebug />
 */
const AuthDebug = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const handleClearAuth = async () => {
    try {
      await logout();
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  };

  const handleCheckFirebase = () => {
    console.log('🔍 Firebase Auth User:', auth.currentUser);
    console.log('🔍 Store User:', user);
    console.log('🔍 isAuthenticated:', isAuthenticated);
    console.log('🔍 localStorage:', localStorage);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white p-4 rounded-lg shadow-xl max-w-sm">
      <h3 className="font-bold mb-2 text-yellow-400">🐛 Auth Debug</h3>
      <div className="text-xs space-y-2">
        <div>
          <strong>Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
        </div>
        <div>
          <strong>User:</strong> {user ? user.email : 'None'}
        </div>
        <div>
          <strong>Role:</strong> {user?.role || 'None'}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleCheckFirebase}
            className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
          >
            Check Console
          </button>
          <button
            onClick={handleClearAuth}
            className="px-3 py-1 bg-red-600 rounded text-xs hover:bg-red-700"
          >
            Clear Auth
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
