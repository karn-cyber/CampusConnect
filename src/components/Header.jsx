import { Building2, Calendar, Settings, User } from 'lucide-react'

const Header = ({ currentView, setCurrentView }) => {
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
          <button 
            className={`nav-button ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentView('admin')}
          >
            <Settings size={20} />
            Admin Panel
          </button>
          <button className="nav-button profile">
            <User size={20} />
            Profile
          </button>
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
        
        .nav-button.profile {
          background: rgba(255, 255, 255, 0.1);
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
          }
          
          .nav-button {
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </header>
  )
}

export default Header
