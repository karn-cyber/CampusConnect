import { Navigate } from 'react-router-dom'
import { authAPI } from '../services/api.js'

const ProtectedRoute = ({ children, requireAdmin = false, requireFaculty = false }) => {
  const user = authAPI.getCurrentUser()

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If admin access is required and user is not admin
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  // If faculty access is required and user is not faculty or admin
  if (requireFaculty && !['admin', 'faculty'].includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
