import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Components
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// Public Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';
import PublicMenuGenerator from './pages/MenuGenerator/MenuGenerator';
import Scanner from './pages/Scanner/Scanner';

// Cook Pages
import Dashboard from './pages/cook/Dashboard/Dashboard';
import MenuGenerator from './pages/cook/MenuGenerator/MenuGenerator';
import Recipes from './pages/cook/Recipes/Recipes';
import Nutrition from './pages/cook/Nutrition/Nutrition';
import QRGenerator from './pages/cook/QRGenerator/QRGenerator';

// Guest Pages
import RecipeView from './pages/guest/RecipeView/RecipeView';
import Feedback from './pages/guest/Feedback/Feedback';

import './App.css';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/cook/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/cook/dashboard" /> : <Register />} />
        
        {/* Public Features (No Login Required) */}
        <Route path="/menu-generator" element={<PublicMenuGenerator />} />
        <Route path="/scanner" element={<Scanner />} />
        
        {/* Guest Routes (Public - accessed via QR code) */}
        <Route path="/recipe/:id" element={<RecipeView />} />
        <Route path="/guest/recipe" element={<RecipeView />} />
        <Route path="/guest/feedback" element={<Feedback />} />
        <Route path="/guest/feedback/:recipeId" element={<Feedback />} />
        
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

        {/* Redirect /cook to /cook/dashboard */}
        <Route path="/cook" element={<Navigate to="/cook/dashboard" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
