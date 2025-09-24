import { useState } from 'react'
import { MapPin, Users, Wifi, Monitor, Coffee, Car, Clock, User, Calendar, MessageSquare, Building2 } from 'lucide-react'

const BUILDINGS_DATA = {
  'A Block': {
    name: 'A Block',
    location: 'Academic Building A',
    rooms: {
      '401': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '402': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '403': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '404': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '405': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '406': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '407': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '408': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '409': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '410': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '411': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '303': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] },
      '304': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] },
      '314': { capacity: 150, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC', 'Sound System', 'Microphone'] },
      '501': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] },
      '502': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] },
      '503': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] },
      '504': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] },
      '505': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] },
      '506': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] },
      '507': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] },
      '508': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] }
    }
  },
  'C Block': {
    name: 'C Block',
    location: 'Academic Building C',
    rooms: {
      '101': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] },
      '102': { capacity: 120, amenities: ['WiFi', 'Whiteboard', 'AC'] },
      '201': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '202': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '301': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
      '302': { capacity: 120, amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] }
    }
  },
  'Main Auditorium': {
    name: 'Main Auditorium',
    location: 'Central Campus',
    rooms: {
      'Auditorium': { capacity: 350, amenities: ['Sound System', 'Projector', 'Stage', 'AC', 'Microphone', 'Lighting System'] }
    }
  }
}

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00'
]

// Sample bookings data for demonstration
const SAMPLE_BOOKINGS = [
  { building: 'A Block', room: '401', date: '2025-09-24', timeSlot: '09:00', bookedBy: 'Dr. Smith - Mathematics', duration: '1hr' },
  { building: 'A Block', room: '401', date: '2025-09-24', timeSlot: '14:00', bookedBy: 'Physics Department', duration: '2hr' },
  { building: 'C Block', room: '201', date: '2025-09-24', timeSlot: '10:00', bookedBy: 'Student Council', duration: '3hr' },
  { building: 'Main Auditorium', room: 'Auditorium', date: '2025-09-24', timeSlot: '16:00', bookedBy: 'Annual Function', duration: '4hr' },
]

const RoomBooking = ({ onBookingRequest, bookingRequests }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showRoomDetails, setShowRoomDetails] = useState(false)
  const [currentRoomDetails, setCurrentRoomDetails] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    building: '',
    room: '',
    date: '',
    timeSlot: '',
    duration: '1',
    purpose: '',
    requesterName: '',
    requesterEmail: '',
    additionalNotes: ''
  })

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi size={16} />
      case 'projector': return <Monitor size={16} />
      case 'coffee machine': return <Coffee size={16} />
      case 'ac': return <div className="amenity-dot"></div>
      case 'sound system': return <div className="amenity-dot"></div>
      case 'stage': return <div className="amenity-dot"></div>
      case 'microphone': return <div className="amenity-dot"></div>
      default: return <div className="amenity-dot"></div>
    }
  }

  const handleBookRoom = (building, roomNumber) => {
    setBookingForm({
      ...bookingForm,
      building,
      room: roomNumber,
      date: selectedDate
    })
    setShowBookingForm(true)
  }

  const handleViewRoomDetails = (building, roomNumber) => {
    const roomData = BUILDINGS_DATA[building].rooms[roomNumber]
    setCurrentRoomDetails({
      building,
      room: roomNumber,
      ...roomData,
      location: BUILDINGS_DATA[building].location
    })
    setShowRoomDetails(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const request = {
      ...bookingForm,
      startTime: bookingForm.timeSlot,
      endTime: `${parseInt(bookingForm.timeSlot.split(':')[0]) + parseInt(bookingForm.duration)}:${bookingForm.timeSlot.split(':')[1]}`,
      attendees: '1' // Default value for compatibility
    }
    onBookingRequest(request)
    setShowBookingForm(false)
    setBookingForm({
      building: '',
      room: '',
      date: '',
      timeSlot: '',
      duration: '1',
      purpose: '',
      requesterName: '',
      requesterEmail: '',
      additionalNotes: ''
    })
    alert('Booking request submitted successfully!')
  }

  const isRoomBooked = (building, room, timeSlot) => {
    const bookings = [...SAMPLE_BOOKINGS, ...bookingRequests.filter(req => req.status === 'approved')]
    return bookings.some(booking => 
      booking.building === building && 
      booking.room === room && 
      booking.date === selectedDate && 
      booking.timeSlot === timeSlot
    )
  }

  const getRoomBookings = (building, room) => {
    const bookings = [...SAMPLE_BOOKINGS, ...bookingRequests.filter(req => req.status === 'approved')]
    return bookings.filter(booking => 
      booking.building === building && 
      booking.room === room && 
      booking.date === selectedDate
    )
  }

  return (
    <div className="room-booking">
      <div className="section-header">
        <h2>Room Booking System</h2>
        <p>Select your preferred building and room for booking</p>
      </div>

      {/* Date Selector */}
      <div className="date-selector card">
        <div className="form-group">
          <label className="form-label">Select Date</label>
          <input
            type="date"
            className="form-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Buildings and Rooms */}
      {Object.entries(BUILDINGS_DATA).map(([buildingName, buildingData]) => (
        <div key={buildingName} className="building-section">
          <h3 className="building-title">
            <Building2 size={24} />
            {buildingName}
            <span className="building-subtitle">{buildingData.location}</span>
          </h3>
          
          <div className="rooms-grid grid grid-cols-3">
            {Object.entries(buildingData.rooms).map(([roomNumber, roomData]) => {
              const roomBookings = getRoomBookings(buildingName, roomNumber)
              const hasBookings = roomBookings.length > 0
              
              return (
                <div key={roomNumber} className="room-card card">
                  <div className="room-header">
                    <h4>Room {roomNumber}</h4>
                    <div className="room-capacity">
                      <Users size={16} />
                      <span>{roomData.capacity} seats</span>
                    </div>
                  </div>

                  <div className="room-amenities">
                    {roomData.amenities.map((amenity, index) => (
                      <div key={index} className="amenity-tag">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Time Slots */}
                  <div className="time-slots">
                    <h5>Today's Schedule</h5>
                    <div className="slots-grid">
                      {TIME_SLOTS.map(timeSlot => {
                        const isBooked = isRoomBooked(buildingName, roomNumber, timeSlot)
                        const booking = roomBookings.find(b => b.timeSlot === timeSlot)
                        
                        return (
                          <div 
                            key={timeSlot} 
                            className={`time-slot ${isBooked ? 'booked' : 'available'}`}
                            title={isBooked ? `Booked by: ${booking?.bookedBy}` : 'Available'}
                          >
                            <span className="time">{timeSlot}</span>
                            {isBooked && (
                              <div className="booking-info">
                                <span className="booker">{booking?.bookedBy}</span>
                                <span className="duration">{booking?.duration}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Booking Summary */}
                  {hasBookings && (
                    <div className="booking-summary">
                      <h6>Today's Bookings:</h6>
                      {roomBookings.map((booking, index) => (
                        <div key={index} className="booking-item">
                          <Clock size={14} />
                          <span>{booking.timeSlot} - {booking.bookedBy}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="room-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleViewRoomDetails(buildingName, roomNumber)}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleBookRoom(buildingName, roomNumber)}
                    >
                      Book Room
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Room Details Modal */}
      {showRoomDetails && currentRoomDetails && (
        <div className="modal-overlay" onClick={() => setShowRoomDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Room {currentRoomDetails.room} - {currentRoomDetails.building}</h3>
            
            <div className="room-details">
              <div className="room-detail">
                <MapPin size={18} />
                <span>{currentRoomDetails.location}</span>
              </div>
              <div className="room-detail">
                <Users size={18} />
                <span>Capacity: {currentRoomDetails.capacity} people</span>
              </div>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <h4>Amenities</h4>
              <div className="room-amenities">
                {currentRoomDetails.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-tag">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowRoomDetails(false)}>
                Close
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setShowRoomDetails(false)
                  handleBookRoom(currentRoomDetails.building, currentRoomDetails.room)
                }}
              >
                Book This Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="modal-overlay" onClick={() => setShowBookingForm(false)}>
          <div className="modal-content booking-form-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Book Room {bookingForm.room} - {bookingForm.building}</h3>
            
            <form onSubmit={handleFormSubmit}>
              <div className="form-grid grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Building</label>
                  <input
                    type="text"
                    className="form-input"
                    value={bookingForm.building}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Room</label>
                  <input
                    type="text"
                    className="form-input"
                    value={bookingForm.room}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={bookingForm.requesterName}
                    onChange={(e) => setBookingForm({...bookingForm, requesterName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={bookingForm.requesterEmail}
                    onChange={(e) => setBookingForm({...bookingForm, requesterEmail: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Slot *</label>
                  <select
                    className="form-select"
                    value={bookingForm.timeSlot}
                    onChange={(e) => setBookingForm({...bookingForm, timeSlot: e.target.value})}
                    required
                  >
                    <option value="">Select Time Slot</option>
                    {TIME_SLOTS.map(slot => (
                      <option 
                        key={slot} 
                        value={slot}
                        disabled={isRoomBooked(bookingForm.building, bookingForm.room, slot)}
                      >
                        {slot} {isRoomBooked(bookingForm.building, bookingForm.room, slot) ? '(Booked)' : '(Available)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (hours) *</label>
                  <select
                    className="form-select"
                    value={bookingForm.duration}
                    onChange={(e) => setBookingForm({...bookingForm, duration: e.target.value})}
                    required
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Purpose of Booking *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={bookingForm.purpose}
                    onChange={(e) => setBookingForm({...bookingForm, purpose: e.target.value})}
                    placeholder="e.g., Team Meeting, Study Session, Presentation"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea
                  className="form-textarea"
                  value={bookingForm.additionalNotes}
                  onChange={(e) => setBookingForm({...bookingForm, additionalNotes: e.target.value})}
                  placeholder="Any special requirements or additional information..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookingForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Calendar size={16} />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .room-booking {
          padding: 2rem 0;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .section-header h2 {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .section-header p {
          color: var(--text-secondary);
          font-size: 1.125rem;
        }
        
        .date-selector {
          max-width: 300px;
          margin: 0 auto 3rem;
          text-align: center;
        }
        
        .building-section {
          margin-bottom: 3rem;
        }
        
        .building-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--border-color);
        }
        
        .building-subtitle {
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-secondary);
          margin-left: auto;
        }
        
        .rooms-grid {
          gap: 2rem;
        }
        
        .room-card {
          border: 2px solid transparent;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .room-card:hover {
          border-color: var(--primary-color);
          transform: translateY(-4px);
        }
        
        .room-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .room-header h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .room-capacity {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        
        .room-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .amenity-tag {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--background);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .amenity-dot {
          width: 4px;
          height: 4px;
          background: var(--primary-color);
          border-radius: 50%;
        }
        
        .time-slots {
          margin-bottom: 1.5rem;
        }
        
        .time-slots h5 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
        }
        
        .time-slot {
          padding: 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          text-align: center;
          border: 1px solid var(--border-color);
        }
        
        .time-slot.available {
          background: #d1fae5;
          color: #065f46;
          border-color: #10b981;
        }
        
        .time-slot.booked {
          background: #fee2e2;
          color: #991b1b;
          border-color: #ef4444;
        }
        
        .time-slot .time {
          display: block;
          font-weight: 600;
        }
        
        .booking-info {
          display: block;
          margin-top: 0.25rem;
        }
        
        .booking-info .booker {
          display: block;
          font-size: 0.65rem;
          opacity: 0.8;
        }
        
        .booking-info .duration {
          display: block;
          font-size: 0.6rem;
          opacity: 0.7;
        }
        
        .booking-summary {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.5rem;
          padding: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .booking-summary h6 {
          font-size: 0.75rem;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 0.5rem;
        }
        
        .booking-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #92400e;
          margin-bottom: 0.25rem;
        }
        
        .booking-item:last-child {
          margin-bottom: 0;
        }
        
        .room-actions {
          display: flex;
          gap: 0.75rem;
        }
        
        .room-actions .btn {
          flex: 1;
          padding: 0.625rem;
          font-size: 0.875rem;
        }
        
        .booking-form-modal {
          max-width: 600px;
          max-height: 90vh;
        }
        
        .form-grid {
          gap: 1rem;
        }
        
        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }
        
        .room-details {
          margin-bottom: 1rem;
        }
        
        .room-detail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .room-actions {
            flex-direction: column;
          }
          
          .building-title {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .building-subtitle {
            margin-left: 0;
          }
          
          .slots-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .slots-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default RoomBooking
