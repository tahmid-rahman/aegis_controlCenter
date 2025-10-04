// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { EmergencyProvider } from './contexts/EmergencyContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Emergencies from './pages/Emergencies'
import Responders from './pages/Responders'
import Messages from './pages/Messages'
import Evidence from './pages/Evidence'
import Analytics from './pages/Analytics'
import Reports from './pages/Reports'
import Resources from './pages/Resources'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Welcome from './pages/Welcome'
import TestApiConnection from './services/testApiConnection'
import './styles/globals.css'

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-on-surface-variant">Loading...</p>
    </div>
  </div>
)

// Protected Route Component - SIMPLIFIED
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Public Route Component - SIMPLIFIED  
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return !isAuthenticated ? children : <Navigate to="/" replace />
}

// Main App Routes Component
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Layout>
      <Routes>
        {/* Public routes - only accessible when NOT authenticated */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/welcome" 
          element={
            <PublicRoute>
              <Welcome />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes - only accessible when authenticated */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/emergencies" 
          element={
            <ProtectedRoute>
              <Emergencies />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/responders" 
          element={
            <ProtectedRoute>
              <Responders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/evidence" 
          element={
            <ProtectedRoute>
              <Evidence />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resources" 
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/test-api" 
          element={
            <ProtectedRoute>
              <TestApiConnection />
            </ProtectedRoute>
          } 
        />

        {/* Default redirect */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} 
        />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <EmergencyProvider>
            <AppRoutes />
          </EmergencyProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App