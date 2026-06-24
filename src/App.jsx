import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DocumentUpload from './pages/DocumentUpload';
import AIChat from './pages/AIChat';
import History from './pages/History';
import Profile from './pages/Profile';

export default function App() {
  // Load initial authentication state from localStorage for smooth demo feel
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('dt_auth') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('dt_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('dt_auth', 'false');
  };

  // Helper route wrapper for protected pages
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Helper route wrapper to prevent access to login/signup when already logged in
  const PublicOnlyRoute = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicOnlyRoute>
              <LandingPage />
            </PublicOnlyRoute>
          } />
          
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login onLogin={handleLogin} />
            </PublicOnlyRoute>
          } />
          
          <Route path="/signup" element={
            <PublicOnlyRoute>
              <Signup onLogin={handleLogin} />
            </PublicOnlyRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/upload" element={
            <ProtectedRoute>
              <DocumentUpload />
            </ProtectedRoute>
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          } />
          
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Catch-all fallback redirects to landing or dashboard depending on auth */}
          <Route path="*" element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
