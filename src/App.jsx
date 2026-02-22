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
import AdminLogin from './pages/admin/Login/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard/AdminDashboard';
import UserManagement from './pages/admin/Users/UserManagement';
import TicketManagement from './pages/admin/Tickets/TicketManagement';
import ContentModeration from './pages/admin/Moderation/ContentModeration';
import ActivityLogs from './pages/admin/Logs/ActivityLogs';

import './App.css';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/feedback/:dishId" element={<Feedback />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/cook/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/cook/dashboard" /> : <Register />} />
        <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/cook/dashboard" /> : <ForgotPassword />} />
        
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
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
