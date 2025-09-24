import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import RoomBooking from './components/RoomBooking'
import AdminPanel from './components/AdminPanel'
import Login from './components/Login'
import Signup from './components/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import { authAPI } from './services/api.js'
import './App.css'

// Main App Content Component
function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = authAPI.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    navigate('/')
  }

  const handleSignup = (userData) => {
    setUser(userData)
    navigate('/')
  }

  const handleLogout = () => {
    authAPI.logout()
    setUser(null)
    navigate('/login')
  }

  // Get current route for header highlighting
  const getCurrentView = () => {
    const path = location.pathname
    if (path === '/') return 'dashboard'
    if (path === '/room-booking') return 'booking'
    if (path === '/admin') return 'admin'
    return 'dashboard'
  }

  const handleHeaderNavigation = (view) => {
    switch (view) {
      case 'dashboard':
        navigate('/')
        break
      case 'booking':
        navigate('/room-booking')
        break
      case 'admin':
        navigate('/admin')
        break
      default:
        navigate('/')
    }
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Campus Connect</h2>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const isDashboard = location.pathname === '/'
  const isAuthRoute = ['/login', '/signup'].includes(location.pathname)

  return (
    <div className="app">
      {/* Only show header when user is authenticated and not on auth routes */}
      {user && !isAuthRoute && (
        <Header 
          currentView={getCurrentView()} 
          setCurrentView={handleHeaderNavigation}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <main className={user && !isAuthRoute ? (isDashboard ? 'main-content-full' : 'main-content') : 'main-content-auth'}>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={<Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup" 
            element={<Signup onSignup={handleSignup} />} 
          />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/room-booking" 
            element={
              <ProtectedRoute>
                <RoomBooking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          {/* Placeholder routes for future features - all protected */}
          <Route 
            path="/laundry" 
            element={
              <ProtectedRoute>
                <div className="feature-placeholder">
                  <h2>🧺 Laundry Tracking</h2>
                  <p>Track your laundry status and get notifications when ready.</p>
                  <p><strong>Coming Soon!</strong></p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/psychologist" 
            element={
              <ProtectedRoute>
                <div className="feature-placeholder">
                  <h2>🧠 Psychologist Services</h2>
                  <p>Book appointments with campus counselors and mental health support.</p>
                  <p><strong>Coming Soon!</strong></p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/medicines" 
            element={
              <ProtectedRoute>
                <div className="feature-placeholder">
                  <h2>💊 Medicine Services</h2>
                  <p>Access campus medical services and prescription management.</p>
                  <p><strong>Coming Soon!</strong></p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stationary" 
            element={
              <ProtectedRoute>
                <div className="feature-placeholder">
                  <h2>📚 Stationary Ordering</h2>
                  <p>Order books, supplies, and academic materials online.</p>
                  <p><strong>Coming Soon!</strong></p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/car-pooling" 
            element={
              <ProtectedRoute>
                <div className="feature-placeholder">
                  <h2>🚗 Car Pooling</h2>
                  <p>Find rides and share transportation with fellow students.</p>
                  <p><strong>Coming Soon!</strong></p>
                </div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
