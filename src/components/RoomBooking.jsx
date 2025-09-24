import React, { useState, useEffect, useMemo } from 'react'
import { MapPin, Users, Wifi, Monitor, Building2, Loader2, Calendar, Coffee, Car, MessageSquare, X, Search } from 'lucide-react'
import { roomAPI, bookingAPI } from '../services/api.js'
import Toast from './Toast.jsx'
import { useToast } from '../hooks/useToast.js'

const RoomBooking = ({ onBookingRequest }) => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedStartTime, setSelectedStartTime] = useState('')
  const [selectedEndTime, setSelectedEndTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [roomAvailability, setRoomAvailability] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const { toasts, removeToast, success, error: showError } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    department: '',
    purpose: ''
  })

  // Time slots available for booking (30-minute intervals)
  const timeSlots = useMemo(() => [
    '08:30-09:00', '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
    '11:00-11:30', '11:30-12:00', '12:00-12:30', '12:30-13:00', '13:00-13:30',
    '13:30-14:00', '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00',
    '16:00-16:30', '16:30-17:00', '17:00-17:30', '17:30-18:00', '18:00-18:30',
    '18:30-19:00', '19:00-19:30', '19:30-20:00', '20:00-20:30', '20:30-21:00'
  ], [])

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

  // Load today's availability for all rooms
  useEffect(() => {
    if (rooms.length > 0) {
      const loadAvailability = async () => {
        console.log('Loading availability for', rooms.length, 'rooms')
        const today = new Date().toISOString().split('T')[0]
        const availability = {}
        
        for (const room of rooms) {
          try {
            console.log(`Checking availability for ${room.building} - Room ${room.roomNumber}`)
            const response = await bookingAPI.checkAvailability(room.building, room.roomNumber, today)
            console.log(`Availability response for ${room.building}-${room.roomNumber}:`, response)
            
            if (response.success) {
              const roomKey = `${room.building}-${room.roomNumber}`
              // Store both available and booked slots
              availability[roomKey] = {
                availableSlots: response.data.availableSlots || [],
                bookedSlots: response.data.bookedSlots || []
              }
            } else {
              console.warn(`Failed to get availability for ${room.building}-${room.roomNumber}:`, response.message)
              // Default to all slots available if API fails
              const roomKey = `${room.building}-${room.roomNumber}`
              availability[roomKey] = {
                availableSlots: timeSlots,
                bookedSlots: []
              }
            }
          } catch (err) {
            console.error('Error checking availability for room:', room.roomNumber, err)
            // Default to all slots available if there's an error
            const roomKey = `${room.building}-${room.roomNumber}`
            availability[roomKey] = {
              availableSlots: timeSlots,
              bookedSlots: []
            }
          }
        }
        
        console.log('Final availability object:', availability)
        setRoomAvailability(availability)
      }
      
      loadAvailability()
    }
  }, [rooms, timeSlots])

  // Get building abbreviation
  const getBuildingAbbreviation = (buildingName) => {
    const abbreviations = {
      'Academic Block A': 'A',
      'Academic Block B': 'B', 
      'Main Building': 'M',
      'Academic Block C': 'C',
      'Library Block': 'L'
    }
    return abbreviations[buildingName] || buildingName.charAt(0).toUpperCase()
  }

  // Filter rooms based on search term
  const getFilteredRooms = () => {
    if (!searchTerm.trim()) return rooms
    
    return rooms.filter(room => {
      const buildingAbbrev = getBuildingAbbreviation(room.building)
      const roomDisplayName = `${buildingAbbrev} - ${room.roomNumber}`
      const searchLower = searchTerm.toLowerCase()
      
      return (
        roomDisplayName.toLowerCase().includes(searchLower) ||
        room.building.toLowerCase().includes(searchLower) ||
        room.roomNumber.toString().includes(searchLower) ||
        (room.amenities || []).some(amenity => amenity.toLowerCase().includes(searchLower))
      )
    })
  }

  // Group filtered rooms by building
  const getFilteredGroupedRooms = () => {
    const filtered = getFilteredRooms()
    const grouped = {}
    filtered.forEach(room => {
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
    setSelectedStartTime('')
    setSelectedEndTime('')
    setAvailableSlots([])
    setShowForm(true)
    
    if (selectedDate) {
      checkAvailability(room.building, room.roomNumber, selectedDate)
    }
  }

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date)
    setSelectedStartTime('')
    setSelectedEndTime('')
    
    if (selectedRoom) {
      checkAvailability(selectedRoom.building, selectedRoom.roomNumber, date)
    } else {
      setAvailableSlots(timeSlots)
    }
  }

  // Helper function to get available end times based on start time
  const getAvailableEndTimes = (startTime) => {
    if (!startTime) return []
    
    const startIndex = timeSlots.findIndex(slot => slot.split('-')[0] === startTime)
    if (startIndex === -1) return []
    
    // Allow booking for maximum 2 hours (4 slots of 30 minutes each)
    const maxSlots = 4
    const endTimes = []
    
    for (let i = 1; i <= maxSlots && startIndex + i < timeSlots.length; i++) {
      const endTime = timeSlots[startIndex + i].split('-')[1]
      endTimes.push(endTime)
    }
    
    return endTimes
  }

  // Helper function to get all time slots between start and end
  const getSelectedTimeSlots = (startTime, endTime) => {
    if (!startTime || !endTime) return []
    
    const startIndex = timeSlots.findIndex(slot => slot.split('-')[0] === startTime)
    const endIndex = timeSlots.findIndex(slot => slot.split('-')[1] === endTime)
    
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) return []
    
    return timeSlots.slice(startIndex, endIndex + 1)
  }

  // Handle booking form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedRoom || !selectedDate || !selectedStartTime || !selectedEndTime) {
      showError('Missing Information', 'Please select a room, date, start time, and end time')
      return
    }

    try {
      setSubmitting(true)
      
      const selectedSlots = getSelectedTimeSlots(selectedStartTime, selectedEndTime)
      const timeSlotString = `${selectedStartTime}-${selectedEndTime}`
      
      const bookingData = {
        ...formData,
        building: selectedRoom.building,
        room: selectedRoom.roomNumber,
        date: selectedDate,
        timeSlot: timeSlotString,
        timeSlots: selectedSlots
      }

      const response = await bookingAPI.create(bookingData)
      
      if (response.success) {
        if (onBookingRequest) {
          onBookingRequest(response.data)
        }
        
        // Reset form
        resetForm()
        
        // Show success toast
        success(
          'Booking Request Submitted!', 
          `Your request for ${selectedRoom.building} - Room ${selectedRoom.roomNumber} has been submitted successfully. You'll receive a notification once it's reviewed.`
        )
      }
    } catch (err) {
      console.error('Error submitting booking:', err)
      showError(
        'Booking Failed', 
        err.message || 'Failed to submit booking request. Please check your details and try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Reset form to initial state
  const resetForm = () => {
    setShowForm(false)
    setSelectedRoom(null)
    setSelectedDate('')
    setSelectedStartTime('')
    setSelectedEndTime('')
    setAvailableSlots([])
    setFormData({
      name: '',
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

  const buildingsData = getFilteredGroupedRooms()

  // Main render
  return (
    <div className="room-booking">
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />
      
      <div className="booking-header">
        <div className="header-top">
          <div className="header-content">
            <h1>Room Booking System</h1>
            <p>Select from available rooms across campus buildings</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search rooms (e.g., A - 303, WiFi, Projector...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
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
                  <h4>{getBuildingAbbreviation(room.building)} - {room.roomNumber}</h4>
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

                {/* Today's Availability Indicators */}
                <div className="availability-preview">
                  <div className="availability-title">Evening Slots (5-11 PM)</div>
                  <div className="slots-grid">
                    {timeSlots
                      .filter(slot => {
                        const startTime = slot.split('-')[0]
                        const hour = parseInt(startTime.split(':')[0])
                        return hour >= 17 && hour <= 22 // 5 PM (17:00) to 10:30 PM (22:30)
                      })
                      .map((slot) => {
                        const roomKey = `${room.building}-${room.roomNumber}`
                        const roomData = roomAvailability[roomKey] || { availableSlots: [], bookedSlots: [] }
                        const isAvailable = roomData.availableSlots.includes(slot)
                        const isBooked = roomData.bookedSlots.includes(slot)
                        
                        return (
                          <div 
                            key={slot}
                            className={`time-slot-indicator ${isBooked ? 'booked' : isAvailable ? 'available' : 'unavailable'}`}
                            title={`${slot} - ${isBooked ? 'Booked' : isAvailable ? 'Available' : 'Unavailable'}`}
                          >
                            {slot}
                          </div>
                        )
                      })}
                  </div>
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
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time *</label>
                    <select
                      required
                      value={selectedStartTime}
                      onChange={(e) => {
                        setSelectedStartTime(e.target.value)
                        setSelectedEndTime('') // Reset end time when start time changes
                      }}
                      disabled={!selectedDate}
                    >
                      <option value="">Select start time</option>
                      {timeSlots.map((slot) => {
                        const startTime = slot.split('-')[0]
                        const isAvailable = availableSlots.includes(slot)
                        return (
                          <option key={startTime} value={startTime} disabled={!isAvailable}>
                            {startTime} {!isAvailable ? '(Booked)' : ''}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>End Time * (Max 2 hours)</label>
                    <select
                      required
                      value={selectedEndTime}
                      onChange={(e) => setSelectedEndTime(e.target.value)}
                      disabled={!selectedStartTime}
                    >
                      <option value="">Select end time</option>
                      {getAvailableEndTimes(selectedStartTime).map((endTime) => (
                        <option key={endTime} value={endTime}>
                          {endTime}
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
                    <label>Student/Staff ID</label>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      placeholder="Enter your ID number"
                    />
                  </div>
                </div>
                <div className="form-row">
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

      {/* User Profile Modal - Removed: Now accessible from nav bar */}

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

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header-content {
          flex: 1;
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

        .profile-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .profile-button:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .search-section {
          margin-bottom: 1rem;
        }

        .search-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          max-width: 500px;
          margin: 0 auto;
          background: white;
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 0.75rem 1.25rem;
          transition: all 0.3s;
        }

        .search-container:focus-within {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1rem;
          color: var(--text-primary);
          background: transparent;
        }

        .search-input::placeholder {
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

        /* Availability Preview Styles */
        .availability-preview {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .availability-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
          gap: 0.4rem;
        }

        .time-slot-indicator {
          padding: 0.3rem 0.2rem;
          border-radius: 6px;
          font-size: 0.6rem;
          font-weight: 600;
          text-align: center;
          transition: all 0.2s ease;
          cursor: pointer;
          border: 2px solid;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .time-slot-indicator.available {
          background-color: #dcfce7;
          color: #166534;
          border-color: #16a34a;
        }

        .time-slot-indicator.booked {
          background-color: #fecaca;
          color: #991b1b;
          border-color: #dc2626;
        }

        .time-slot-indicator.unavailable {
          background-color: #f3f4f6;
          color: #6b7280;
          border-color: #d1d5db;
        }

        .time-slot-indicator:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

          .header-top {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .search-container {
            max-width: 100%;
            margin: 0;
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

          .profile-button {
            padding: 0.625rem 1.25rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  )
}

export default RoomBooking
