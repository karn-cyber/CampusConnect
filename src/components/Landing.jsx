import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api.js'

const Landing = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    const user = authAPI.getCurrentUser()
    if (user) {
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [navigate])

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

export default Landing
