import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Components
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/common/ProtectedRoute/AdminRoute';
import ToastContainer from './components/common/Toast/ToastContainer';

// Public Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';
import Feedback from './pages/Feedback/Feedback';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
import PublicMenuGenerator from './pages/MenuGenerator/MenuGenerator';
import Scanner from './pages/Scanner/Scanner';

// Cook Pages
import Dashboard from './pages/cook/Dashboard/Dashboard';
import MenuGenerator from './pages/cook/MenuGenerator/MenuGenerator';
import Recipes from './pages/cook/Recipes/Recipes';
import BrowseRecipes from './pages/cook/BrowseRecipes/BrowseRecipes';
import Nutrition from './pages/cook/Nutrition/Nutrition';
import QRGenerator from './pages/cook/QRGenerator/QRGenerator';
import ScanQR from './pages/cook/ScanQR/ScanQR';
import RecipeFinder from './pages/cook/RecipeFinder/RecipeFinder';
import PortionCalculator from './pages/cook/PortionCalculator/PortionCalculator';
import CookFeedback from './pages/cook/Feedback/Feedback';
import FeedbackDashboard from './pages/cook/FeedbackDashboard/FeedbackDashboard';
import Support from './pages/cook/Support/Support';
import Profile from './pages/cook/Profile/Profile';

// Guest Pages
import RecipeView from './pages/guest/RecipeView/RecipeView';
import GuestFeedback from './pages/guest/Feedback/Feedback';

// Admin Pages
import AdminLogin from './pages/admin/Login/AdminLogin.jsx';
import AdminDashboard from './pages/admin/Dashboard/AdminDashboard.jsx';
import UserManagement from './pages/admin/Users/UserManagement.jsx';
import TicketManagement from './pages/admin/Tickets/TicketManagement.jsx';
import ContentModeration from './pages/admin/Moderation/ContentModeration.jsx';
import ActivityLogs from './pages/admin/Logs/ActivityLogs.jsx';
import RecipeManagement from './pages/admin/Recipes/RecipeManagement.jsx';
import FeedbackManagement from './pages/admin/Feedback/FeedbackManagement.jsx';
import APIConfig from './pages/admin/APIConfig/APIConfig.jsx';

import './App.css';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    console.log('🚀 [APP] Initializing app...');
    const unsubscribe = initialize();
    
    // Wait a brief moment for the auth state to be determined
    const timer = setTimeout(() => {
      console.log('✅ [APP] Initialization complete');
      console.log('📊 [APP] isAuthenticated:', isAuthenticated);
      console.log('👤 [APP] user:', user ? user.email : 'null');
      setIsInitializing(false);
    }, 300);
    
    return () => {
      if (unsubscribe) unsubscribe();
      clearTimeout(timer);
    };
  }, [initialize]);

  // Show loading screen while checking authentication state
  if (isInitializing) {
    console.log('⏳ [APP] Still initializing...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('🎯 [APP] Rendering routes with isAuthenticated:', isAuthenticated);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/feedback/:dishId" element={<Feedback />} />
        <Route 
          path="/login" 
          element={
            (() => {
              console.log('🔍 [ROUTE] /login - isAuthenticated:', isAuthenticated);
              return isAuthenticated ? <Navigate to="/cook/dashboard" replace /> : <Login />;
            })()
          } 
        />
        <Route 
          path="/register" 
          element={
            (() => {
              console.log('🔍 [ROUTE] /register - isAuthenticated:', isAuthenticated);
              return isAuthenticated ? <Navigate to="/cook/dashboard" replace /> : <Register />;
            })()
          } 
        />
        <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/cook/dashboard" replace /> : <ForgotPassword />} />
        
        {/* Public Features (No Login Required) */}
        <Route path="/menu-generator" element={<PublicMenuGenerator />} />
        <Route path="/scanner" element={<Scanner />} />
        
        {/* Guest Routes (Public - accessed via QR code) */}
        <Route path="/recipe/:id" element={<RecipeView />} />
        <Route path="/guest/recipe" element={<RecipeView />} />
        <Route path="/guest/feedback" element={<GuestFeedback />} />
        <Route path="/guest/feedback/:recipeId" element={<GuestFeedback />} />
        
        {/* Protected Cook Routes */}
        <Route
          path="/cook/dashboard"
          element={
            <ProtectedRoute requiredRole="cook">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/menu-generator"
          element={
            <ProtectedRoute requiredRole="cook">
              <MenuGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/recipes"
          element={
            <ProtectedRoute requiredRole="cook">
              <Recipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/browse-recipes"
          element={
            <ProtectedRoute requiredRole="cook">
              <BrowseRecipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/nutrition"
          element={
            <ProtectedRoute requiredRole="cook">
              <Nutrition />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/qr-generator"
          element={
            <ProtectedRoute requiredRole="cook">
              <QRGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/scan-qr"
          element={
            <ProtectedRoute requiredRole="cook">
              <ScanQR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/recipe-finder"
          element={
            <ProtectedRoute requiredRole="cook">
              <RecipeFinder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/portion-calculator"
          element={
            <ProtectedRoute requiredRole="cook">
              <PortionCalculator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/feedback"
          element={
            <ProtectedRoute requiredRole="cook">
              <CookFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/feedback-dashboard"
          element={
            <ProtectedRoute requiredRole="cook">
              <FeedbackDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/support"
          element={
            <ProtectedRoute requiredRole="cook">
              <Support />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cook/profile"
          element={
            <ProtectedRoute requiredRole="cook">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Redirect /cook to /cook/dashboard */}
        <Route path="/cook" element={<Navigate to="/cook/dashboard" replace />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <AdminRoute>
              <TicketManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/moderation"
          element={
            <AdminRoute>
              <ContentModeration />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <AdminRoute>
              <ActivityLogs />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/recipes"
          element={
            <AdminRoute>
              <RecipeManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <AdminRoute>
              <FeedbackManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/api-config"
          element={
            <AdminRoute>
              <APIConfig />
            </AdminRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
