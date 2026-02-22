import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { isAdmin } from '../../../services/firebase/adminService';

const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const [checking, setChecking] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      setChecking(false);
      return;
    }

    try {
      const adminStatus = await isAdmin(user.uid);
      setHasAdminAccess(adminStatus);
    } catch (error) {
      console.error('Error checking admin access:', error);
      setHasAdminAccess(false);
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!hasAdminAccess) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
