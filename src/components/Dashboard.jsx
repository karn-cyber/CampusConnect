import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Calendar, 
  Shirt, 
  Building2, 
  Brain, 
  Pill, 
  BookOpen, 
  Car,
  ArrowRight
} from 'lucide-react'

const HERO_SLIDES = [
  {
    id: 1,
    title: "Clan Activities",
    subtitle: "Join Your Campus Clan",
    description: "Participate in exciting clan competitions, team building activities, and represent your house in various campus events.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
    color: "from-purple-600 to-blue-600"
  },
  {
    id: 2,
    title: "Club Activities", 
    subtitle: "Discover Your Passion",
    description: "Explore diverse clubs ranging from tech and arts to sports and culture. Find your community and pursue your interests.",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800",
    color: "from-green-600 to-teal-600"
  },
  {
    id: 3,
    title: "Student Events",
    subtitle: "Never Miss Out",
    description: "Stay updated with all campus events, workshops, seminars, and social gatherings happening around you.",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
    color: "from-orange-600 to-red-600"
  }
]

const FEATURES = [
  {
    id: 'laundry',
    title: 'Laundry Tracking',
    description: 'Track your laundry status and get notifications when ready',
    icon: Shirt,
    color: 'bg-blue-500',
    available: false,
    route: '/laundry'
  },
  {
    id: 'room-booking',
    title: 'Room Booking',
    description: 'Book study rooms, conference halls, and other facilities',
    icon: Building2,
    color: 'bg-green-500',
    available: true,
    route: '/room-booking'
  },
  {
    id: 'psychologist',
    title: 'Psychologist',
    description: 'Book appointments with campus counselors and mental health support',
    icon: Brain,
    color: 'bg-purple-500',
    available: false,
    route: '/psychologist'
  },
  {
    id: 'medicines',
    title: 'Medicines',
    description: 'Access campus medical services and prescription management',
    icon: Pill,
    color: 'bg-red-500',
    available: false,
    route: '/medicines'
  },
  {
    id: 'stationary',
    title: 'Stationary',
    description: 'Order books, supplies, and academic materials online',
    icon: BookOpen,
    color: 'bg-yellow-500',
    available: false,
    route: '/stationary'
  },
  {
    id: 'car-pooling',
    title: 'Car Pooling',
    description: 'Find rides and share transportation with fellow students',
    icon: Car,
    color: 'bg-indigo-500',
    available: false,
    route: '/car-pooling'
  }
]

const Dashboard = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    rollNumber: '',
    year: '',
    branch: '',
    phone: '',
    activityType: '',
    preferences: ''
  })

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  const handleRegister = (slide) => {
    setSelectedActivity(slide)
    setRegistrationForm({ ...registrationForm, activityType: slide.title })
    setShowRegistrationForm(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log('Registration submitted:', registrationForm)
    alert(`Registration successful for ${selectedActivity.title}!`)
    setShowRegistrationForm(false)
    setRegistrationForm({
      name: '',
      email: '',
      rollNumber: '',
      year: '',
      branch: '',
      phone: '',
      activityType: '',
      preferences: ''
    })
  }

  const handleFeatureClick = (feature) => {
    if (feature.available) {
      navigate(feature.route)
    } else {
      navigate(feature.route) // Navigate to placeholder page
    }
  }

  const currentSlideData = HERO_SLIDES[currentSlide]

  return (
    <div className="dashboard">
      {/* Hero Carousel Section */}
      <section className="hero-section">
        <div className="carousel-container">
          <div 
            className="carousel-slide"
            style={{ backgroundImage: `url(${currentSlideData.image})` }}
          >
            <div className={`slide-overlay bg-gradient-to-r ${currentSlideData.color}`}>
              <div className="slide-content">
                <div className="slide-text">
                  <h1>{currentSlideData.title}</h1>
                  <h2>{currentSlideData.subtitle}</h2>
                  <p>{currentSlideData.description}</p>
                  <button 
                    className="register-btn"
                    onClick={() => handleRegister(currentSlideData)}
                  >
                    Register Now
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <button className="carousel-btn prev" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-btn next" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Campus Features</h2>
            <p>Access all campus services in one place</p>
          </div>

          <div className="features-grid">
            {FEATURES.map((feature) => {
              const IconComponent = feature.icon
              return (
                <div 
                  key={feature.id}
                  className={`feature-card ${feature.available ? 'available' : 'coming-soon'}`}
                  onClick={() => handleFeatureClick(feature)}
                >
                  <div className={`feature-icon ${feature.color}`}>
                    <IconComponent size={32} />
                  </div>
                  <div className="feature-content">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    {!feature.available && (
                      <span className="coming-soon-badge">Coming Soon</span>
                    )}
                  </div>
                  <div className="feature-arrow">
                    <ArrowRight size={20} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="modal-overlay" onClick={() => setShowRegistrationForm(false)}>
          <div className="modal-content registration-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register for {selectedActivity?.title}</h3>
            </div>

            <form onSubmit={handleFormSubmit} className="registration-form">
              <div className="form-grid grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={registrationForm.name}
                    onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Roll Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={registrationForm.rollNumber}
                    onChange={(e) => setRegistrationForm({...registrationForm, rollNumber: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={registrationForm.phone}
                    onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Year *</label>
                  <select
                    className="form-select"
                    value={registrationForm.year}
                    onChange={(e) => setRegistrationForm({...registrationForm, year: e.target.value})}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Branch *</label>
                  <select
                    className="form-select"
                    value={registrationForm.branch}
                    onChange={(e) => setRegistrationForm({...registrationForm, branch: e.target.value})}
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Chemical">Chemical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Why do you want to join?</label>
                <textarea
                  className="form-textarea"
                  value={registrationForm.preferences}
                  onChange={(e) => setRegistrationForm({...registrationForm, preferences: e.target.value})}
                  placeholder="Tell us about your interests and what you hope to gain..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRegistrationForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Users size={16} />
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dashboard {
          min-height: 100vh;
        }

        /* Hero Carousel Styles */
        .hero-section {
          height: 70vh;
          position: relative;
          overflow: hidden;
        }

        .carousel-container {
          position: relative;
          height: 100%;
        }

        .carousel-slide {
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
        }

        .slide-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slide-content {
          text-align: center;
          color: white;
          max-width: 800px;
          padding: 0 2rem;
        }

        .slide-text h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .slide-text h2 {
          font-size: 1.5rem;
          font-weight: 400;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .slide-text p {
          font-size: 1.125rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.8;
        }

        .register-btn {
          background: white;
          color: var(--primary-color);
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.3s ease;
        }

        .carousel-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .carousel-btn.prev {
          left: 2rem;
        }

        .carousel-btn.next {
          right: 2rem;
        }

        .carousel-indicators {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: white;
        }

        /* Features Section */
        .features-section {
          padding: 5rem 0;
          background: var(--background);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .section-header p {
          font-size: 1.25rem;
          color: var(--text-secondary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: var(--card-background);
          border-radius: 1rem;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          box-shadow: var(--shadow);
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-color);
        }

        .feature-card.coming-soon {
          opacity: 0.7;
        }

        .feature-card.coming-soon:hover {
          transform: none;
          border-color: var(--border-color);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .feature-content {
          flex: 1;
        }

        .feature-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .feature-content p {
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .coming-soon-badge {
          display: inline-block;
          background: var(--accent-color);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          margin-top: 0.5rem;
        }

        .feature-arrow {
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-arrow {
          color: var(--primary-color);
          transform: translateX(4px);
        }

        .registration-modal {
          max-width: 700px;
          max-height: 90vh;
        }

        .registration-form {
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .slide-text h1 {
            font-size: 2.5rem;
          }

          .slide-text h2 {
            font-size: 1.25rem;
          }

          .slide-text p {
            font-size: 1rem;
          }

          .carousel-btn {
            width: 40px;
            height: 40px;
          }

          .carousel-btn.prev {
            left: 1rem;
          }

          .carousel-btn.next {
            right: 1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            flex-direction: column;
            text-align: center;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
