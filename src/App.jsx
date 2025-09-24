import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import RoomBooking from './components/RoomBooking'
import AdminPanel from './components/AdminPanel'
import './App.css'

// Main App Content Component
function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [bookingRequests, setBookingRequests] = useState([])


  const handleBookingRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      status: 'pending',
      requestDate: new Date().toISOString()
    }
    setBookingRequests(prev => [...prev, newRequest])
  }

  const handleRequestAction = (requestId, action) => {
    setBookingRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: action } : req
      )
    )
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

  const isDashboard = location.pathname === '/'

  return (
    <div className="app">
      <Header 
        currentView={getCurrentView()} 
        setCurrentView={handleHeaderNavigation} 
      />
      <main className={isDashboard ? 'main-content-full' : 'main-content'}>
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard />} 
          />
          <Route 
            path="/room-booking" 
            element={
              <RoomBooking 
                onBookingRequest={handleBookingRequest}
                bookingRequests={bookingRequests}
              />
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminPanel 
                requests={bookingRequests}
                onRequestAction={handleRequestAction}
              />
            } 
          />
          {/* Placeholder routes for future features */}
          <Route 
            path="/laundry" 
            element={
              <div className="feature-placeholder">
                <h2>🧺 Laundry Tracking</h2>
                <p>Track your laundry status and get notifications when ready.</p>
                <p><strong>Coming Soon!</strong></p>
              </div>
            } 
          />
          <Route 
            path="/psychologist" 
            element={
              <div className="feature-placeholder">
                <h2>🧠 Psychologist Services</h2>
                <p>Book appointments with campus counselors and mental health support.</p>
                <p><strong>Coming Soon!</strong></p>
              </div>
            } 
          />
          <Route 
            path="/medicines" 
            element={
              <div className="feature-placeholder">
                <h2>💊 Medicine Services</h2>
                <p>Access campus medical services and prescription management.</p>
                <p><strong>Coming Soon!</strong></p>
              </div>
            } 
          />
          <Route 
            path="/stationary" 
            element={
              <div className="feature-placeholder">
                <h2>📚 Stationary Ordering</h2>
                <p>Order books, supplies, and academic materials online.</p>
                <p><strong>Coming Soon!</strong></p>
              </div>
            } 
          />
          <Route 
            path="/car-pooling" 
            element={
              <div className="feature-placeholder">
                <h2>🚗 Car Pooling</h2>
                <p>Find rides and share transportation with fellow students.</p>
                <p><strong>Coming Soon!</strong></p>
              </div>
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
