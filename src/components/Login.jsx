import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react'
import { authAPI } from '../services/api.js'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.login(formData)
      
      if (response.success) {
        onLogin(response.data.user)
        alert('Login successful!')
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <User size={32} />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your Campus Connect account</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@university.edu"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="loading-spinner" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p><strong>Admin:</strong> admin@campusconnect.edu / admin123456</p>
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          padding: 2rem;
        }

        .auth-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          box-shadow: var(--shadow-2xl);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: var(--primary-light);
          color: var(--primary-color);
          border-radius: 50%;
          margin-bottom: 1rem;
        }

        .auth-header h2 {
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .auth-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          border-left: 4px solid #c33;
        }

        .auth-form {
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-secondary);
          z-index: 1;
        }

        .input-container input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s;
          background: white;
        }

        .input-container input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .input-container input:disabled {
          background: var(--bg-secondary);
          opacity: 0.7;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.3s;
        }

        .password-toggle:hover:not(:disabled) {
          color: var(--primary-color);
        }

        .password-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .auth-button {
          width: 100%;
          padding: 0.875rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .auth-button:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }

        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-footer {
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }

        .auth-footer p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .auth-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .auth-link:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }

        .demo-credentials {
          margin-top: 1.5rem;
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: 8px;
          border-left: 4px solid var(--primary-color);
        }

        .demo-credentials h4 {
          color: var(--text-primary);
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .demo-credentials p {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin: 0.25rem 0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        @media (max-width: 480px) {
          .auth-container {
            padding: 1rem;
          }

          .auth-card {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Login
