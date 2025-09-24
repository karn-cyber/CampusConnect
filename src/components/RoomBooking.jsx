import React, { useState, useEffect } from 'react'
import { MapPin, Users, Wifi, Monitor, Building2, Loader2, Calendar, Coffee, Car, MessageSquare, X } from 'lucide-react'
import { roomAPI, bookingAPI } from '../services/api.js'

const RoomBooking = ({ onBookingRequest }) => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: '',
    purpose: ''
  })

  // Time slots available for booking
  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00',
    '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'
  ]

  // Load rooms on component mount
  useEffect(() => {
    loadRooms()
  }, [])

  // Load all rooms from API
  const loadRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await roomAPI.getAll()
      
      if (response.success) {
        setRooms(response.data)
      } else {
        throw new Error('Failed to load rooms')
      }
    } catch (err) {
      console.error('Error loading rooms:', err)
      setError('Failed to load rooms. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Group rooms by building for organized display
  const groupRoomsByBuilding = () => {
    const grouped = {}
    rooms.forEach(room => {
      if (!grouped[room.building]) {
        grouped[room.building] = {
          name: room.building,
          location: room.location || room.building,
          rooms: []
        }
      }
      grouped[room.building].rooms.push(room)
    })
    return grouped
  }

  // Check room availability for selected date
  const checkAvailability = async (building, roomNumber, date) => {
    if (!date) return

    try {
      const response = await bookingAPI.checkAvailability(building, roomNumber, date)
      if (response.success) {
        setAvailableSlots(response.data.availableSlots || timeSlots)
      }
    } catch (err) {
      console.error('Error checking availability:', err)
      setAvailableSlots(timeSlots)
    }
  }

  // Handle room selection
  const handleRoomSelect = (room) => {
    setSelectedRoom(room)
    setSelectedSlot('')
    setAvailableSlots([])
    setShowForm(true)
    
    if (selectedDate) {
      checkAvailability(room.building, room.roomNumber, selectedDate)
    }
  }

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date)
    setSelectedSlot('')
    
    if (selectedRoom) {
      checkAvailability(selectedRoom.building, selectedRoom.roomNumber, date)
    } else {
      setAvailableSlots(timeSlots)
    }
  }

  // Handle booking form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedRoom || !selectedDate || !selectedSlot) {
      alert('Please select a room, date, and time slot')
      return
    }

    try {
      setSubmitting(true)
      
      const bookingData = {
        ...formData,
        building: selectedRoom.building,
        room: selectedRoom.roomNumber,
        date: selectedDate,
        timeSlot: selectedSlot
      }

      const response = await bookingAPI.create(bookingData)
      
      if (response.success) {
        if (onBookingRequest) {
          onBookingRequest(response.data)
        }
        
        // Reset form
        resetForm()
        alert('Booking request submitted successfully!')
      }
    } catch (err) {
      console.error('Error submitting booking:', err)
      alert(err.message || 'Failed to submit booking request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Reset form to initial state
  const resetForm = () => {
    setShowForm(false)
    setSelectedRoom(null)
    setSelectedDate('')
    setSelectedSlot('')
    setAvailableSlots([])
    setFormData({
      name: '',
      email: '',
      studentId: '',
      department: '',
      purpose: ''
    })
  }

  // Get appropriate icon for amenity
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'WiFi': <Wifi size={16} />,
      'Projector': <Monitor size={16} />,
      'AC': <Coffee size={16} />,
      'Parking': <Car size={16} />,
      'Sound System': <MessageSquare size={16} />,
      'Smart Board': <Monitor size={16} />,
      'Video Conferencing': <Monitor size={16} />
    }
    return iconMap[amenity] || <Monitor size={16} />
  }

  // Get tomorrow's date as minimum selectable date
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Render loading state
  if (loading) {
    return (
      <div className="room-booking">
        <div className="loading-container">
          <Loader2 className="loading-spinner" size={48} />
          <p>Loading rooms...</p>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="room-booking">
        <div className="error-container">
          <h2>Error Loading Rooms</h2>
          <p>{error}</p>
          <button onClick={loadRooms} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const buildingsData = groupRoomsByBuilding()

  // Main render
  return (
    <div className="room-booking">
      <div className="booking-header">
        <h1>🏢 Room Booking System</h1>
        <p>Select from available rooms across campus buildings</p>
      </div>

      {/* Buildings and Rooms Grid */}
      {Object.entries(buildingsData).map(([buildingName, buildingData]) => (
        <div key={buildingName} className="building-section">
          <h3 className="building-title">
            <Building2 size={24} />
            {buildingName}
            <span className="building-subtitle">{buildingData.location}</span>
          </h3>
          
          <div className="rooms-grid">
            {buildingData.rooms.map((room) => (
              <div 
                key={`${room.building}-${room.roomNumber}`} 
                className="room-card"
                onClick={() => handleRoomSelect(room)}
              >
                <div className="room-header">
                  <h4>Room {room.roomNumber}</h4>
                  <div className="room-capacity">
                    <Users size={18} />
                    <span>{room.capacity} capacity</span>
                  </div>
                </div>
                
                <div className="room-location">
                  <MapPin size={16} />
                  <span>{room.location || room.building}</span>
                </div>
                
                <div className="room-amenities">
                  {(room.amenities || []).map((amenity) => (
                    <div key={amenity} className="amenity">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                
                <button className="book-button">
                  <Calendar size={18} />
                  Book This Room
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Booking Form Modal */}
      {showForm && selectedRoom && (
        <div className="booking-modal">
          <div className="booking-form-container">
            <div className="modal-header">
              <h2>Book Room {selectedRoom.roomNumber}</h2>
              <button 
                className="close-button"
                onClick={() => setShowForm(false)}
                type="button"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="room-info">
              {selectedRoom.building} • {selectedRoom.location || selectedRoom.building} • Capacity: {selectedRoom.capacity}
            </p>
            
            <form onSubmit={handleSubmit} className="booking-form">
              {/* Date and Time Selection */}
              <div className="form-section">
                <h3>Date & Time</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      required
                      min={getTomorrowDate()}
                      value={selectedDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Time Slot *</label>
                    <select
                      required
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      disabled={!selectedDate}
                    >
                      <option value="">Select a time slot</option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@university.edu"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Student/Staff ID</label>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      placeholder="Enter your ID number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Your department"
                    />
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div className="form-section">
                <div className="form-group">
                  <label>Purpose of Booking *</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="Describe the purpose of your room booking..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="loading-spinner" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Calendar size={18} />
                      Submit Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .room-booking {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .retry-button {
          padding: 0.75rem 1.5rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s;
        }

        .retry-button:hover {
          background: var(--primary-dark);
        }

        .booking-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .booking-header h1 {
          font-size: 2.5rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .booking-header p {
          font-size: 1.2rem;
          color: var(--text-secondary);
        }

        .building-section {
          margin-bottom: 3rem;
        }

        .building-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .building-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 400;
          margin-left: 0.5rem;
        }

        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .room-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .room-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-color);
        }

        .room-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .room-header h4 {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin: 0;
          font-weight: 600;
        }

        .room-capacity {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .room-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .room-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .amenity {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--bg-secondary);
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .book-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .book-button:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .booking-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .booking-form-container {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-2xl);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-header h2 {
          color: var(--primary-color);
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .close-button {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .room-info {
          color: var(--text-secondary);
          margin: 0;
          padding: 0 2rem;
          font-size: 0.95rem;
        }

        .booking-form {
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section h3 {
          color: var(--text-primary);
          margin-bottom: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .form-group textarea {
          resize: vertical;
          font-family: inherit;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .cancel-button,
        .submit-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.95rem;
        }

        .cancel-button {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .cancel-button:hover:not(:disabled) {
          background: var(--bg-tertiary);
        }

        .submit-button {
          background: var(--primary-color);
          color: white;
        }

        .submit-button:hover:not(:disabled) {
          background: var(--primary-dark);
        }

        .submit-button:disabled,
        .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .room-booking {
            padding: 1rem;
          }

          .booking-header h1 {
            font-size: 2rem;
          }

          .rooms-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .booking-form-container {
            margin: 0;
            border-radius: 12px;
          }

          .modal-header {
            padding: 1.5rem 1.5rem 1rem;
          }

          .booking-form {
            padding: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .building-title {
            font-size: 1.25rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .building-subtitle {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default RoomBooking
