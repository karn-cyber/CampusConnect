import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, User, Lock, Mail, Building, Hash, Eye, EyeOff, Loader2 } from 'lucide-react'
import { authAPI } from '../services/api.js'

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    department: '',
    role: 'student'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordErrors, setPasswordErrors] = useState([])

  const validatePassword = (password) => {
    const errors = []
    if (password.length < 6) errors.push('At least 6 characters')
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter')
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter')
    if (!/[0-9]/.test(password)) errors.push('One number')
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password)
    if (passwordValidation.length > 0) {
      setError('Password does not meet requirements')
      setLoading(false)
      return
    }

    try {
      // Remove confirmPassword before sending
      const { confirmPassword: _, ...signupData } = formData
      const response = await authAPI.register(signupData)
      
      if (response.success) {
        onSignup(response.data.user)
        alert('Account created successfully!')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Real-time password validation
    if (name === 'password') {
      setPasswordErrors(validatePassword(value))
    }
  }

  const departments = [
    'Computer Science', 'Information Technology', 'Electronics', 'Mechanical Engineering',
    'Civil Engineering', 'Business Administration', 'Mathematics', 'Physics',
    'Chemistry', 'Biology', 'English Literature', 'History', 'Psychology', 'Other'
  ]

  return (
    <div className="auth-container">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <div className="auth-icon">
            <UserPlus size={32} />
          </div>
          <h2>Join Campus Connect</h2>
          <p>Create your account to access campus services</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-container">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>
              </div>

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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <div className="input-container">
                  <Hash size={20} className="input-icon" />
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    placeholder="e.g., STU2024001"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <div className="input-container">
                  <Building size={20} className="input-icon" />
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="form-section">
            <h3>Account Security</h3>
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
                  placeholder="Create a strong password"
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
              {formData.password && (
                <div className="password-requirements">
                  {passwordErrors.length > 0 ? (
                    <div className="requirements-list error">
                      <p>Password must have:</p>
                      <ul>
                        {passwordErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="requirements-list success">
                      <p>✅ Password requirements met</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="password-match">
                  {formData.password === formData.confirmPassword ? (
                    <div className="match-status success">✅ Passwords match</div>
                  ) : (
                    <div className="match-status error">❌ Passwords don't match</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || passwordErrors.length > 0 || formData.password !== formData.confirmPassword || !formData.name || !formData.email || !formData.studentId || !formData.department}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="loading-spinner" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
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

        .signup-card {
          max-width: 600px;
        }

        .auth-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%;
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

        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .form-section h3 {
          color: var(--text-primary);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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

        .input-container input,
        .input-container select {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s;
          background: white;
        }

        .input-container select {
          cursor: pointer;
        }

        .input-container input:focus,
        .input-container select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .input-container input:disabled,
        .input-container select:disabled {
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
          z-index: 2;
        }

        .password-toggle:hover:not(:disabled) {
          color: var(--primary-color);
        }

        .password-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .password-requirements {
          margin-top: 0.5rem;
        }

        .requirements-list {
          padding: 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
        }

        .requirements-list.error {
          background: #fee;
          border-left: 3px solid #c33;
          color: #c33;
        }

        .requirements-list.success {
          background: #efe;
          border-left: 3px solid #3c3;
          color: #3c3;
        }

        .requirements-list p {
          margin: 0 0 0.25rem 0;
          font-weight: 500;
        }

        .requirements-list ul {
          margin: 0;
          padding-left: 1rem;
        }

        .password-match {
          margin-top: 0.5rem;
        }

        .match-status {
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .match-status.success {
          color: #3c3;
          background: #efe;
        }

        .match-status.error {
          color: #c33;
          background: #fee;
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
          margin-top: 1rem;
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
          margin-top: 1rem;
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

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .signup-card {
            max-width: 100%;
          }
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

export default Signup
