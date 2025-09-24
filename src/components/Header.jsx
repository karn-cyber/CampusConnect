import { useState, useEffect, useRef } from 'react'
import { Building2, Calendar, Settings, User, LogOut, ChevronDown } from 'lucide-react'

const Header = ({ currentView, setCurrentView, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    setShowUserMenu(false)
    onLogout()
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <Building2 size={32} />
          <h1>CampusConnect</h1>
          <span className="header-subtitle">Room Booking System</span>
        </div>
        
        <nav className="header-nav">
          <button 
            className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <Building2 size={20} />
            Dashboard
          </button>
          <button 
            className={`nav-button ${currentView === 'booking' ? 'active' : ''}`}
            onClick={() => setCurrentView('booking')}
          >
            <Calendar size={20} />
            Book Room
          </button>
          {user && user.role === 'admin' && (
            <button 
              className={`nav-button ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentView('admin')}
            >
              <Settings size={20} />
              Admin Panel
            </button>
          )}
          
          {/* User Menu */}
          <div className="user-menu-container" ref={userMenuRef}>
            <button 
              className="user-menu-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User size={20} />
              <span className="user-name">{user?.name || 'User'}</span>
              <ChevronDown size={16} className={`chevron ${showUserMenu ? 'open' : ''}`} />
            </button>
            
            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-info">
                  <div className="user-details">
                    <p className="user-full-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                    <p className="user-role">{user?.role?.toUpperCase()}</p>
                  </div>
                </div>
                <hr className="menu-divider" />
                <button className="menu-item logout-item" onClick={handleLogout}>
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
      
      <style>{`
        .header {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: var(--shadow-lg);
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .header-brand h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 0;
        }
        
        .header-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          margin-left: -0.5rem;
        }
        
        .header-nav {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .nav-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .nav-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
        }
        
        .nav-button.active {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .user-menu-container {
          position: relative;
        }
        
        .user-menu-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .user-menu-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }
        
        .user-name {
          max-width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .chevron {
          transition: transform 0.2s;
        }
        
        .chevron.open {
          transform: rotate(180deg);
        }
        
        .user-menu-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: white;
          border-radius: 0.75rem;
          box-shadow: var(--shadow-2xl);
          min-width: 280px;
          z-index: 1000;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }
        
        .user-info {
          padding: 1.5rem;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: white;
        }
        
        .user-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .user-full-name {
          font-weight: 600;
          font-size: 1.1rem;
          margin: 0;
        }
        
        .user-email {
          opacity: 0.9;
          font-size: 0.9rem;
          margin: 0;
        }
        
        .user-role {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.5rem;
          align-self: flex-start;
          margin-bottom: 0;
        }
        
        .menu-divider {
          border: none;
          border-top: 1px solid var(--border-color);
          margin: 0;
        }
        
        .menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 0.95rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .menu-item:hover {
          background: var(--bg-secondary);
        }
        
        .logout-item {
          color: var(--danger-color);
        }
        
        .logout-item:hover {
          background: #fee;
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            padding: 0 1rem;
          }
          
          .header-brand {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          
          .header-nav {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .nav-button,
          .user-menu-button {
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
          }
          
          .user-name {
            max-width: 80px;
          }
          
          .user-menu-dropdown {
            right: -1rem;
            min-width: calc(100vw - 2rem);
            max-width: 320px;
          }
        }
      `}</style>
    </header>
  )
}

export default Header
