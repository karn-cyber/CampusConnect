import mongoose from 'mongoose';

const bookingRequestSchema = new mongoose.Schema({
  // User Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },

  // Booking Details
  building: {
    type: String,
    required: true,
    enum: ['A Block', 'C Block', 'Main Auditorium']
  },
  room: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    enum: [
      '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
      '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'
    ]
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },

  // Status and Metadata
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: String,
    trim: true
  },
  reviewedAt: {
    type: Date
  },
  reviewNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingRequestSchema.index({ building: 1, room: 1, date: 1, timeSlot: 1 });
bookingRequestSchema.index({ email: 1 });
bookingRequestSchema.index({ status: 1 });

export default mongoose.model('BookingRequest', bookingRequestSchema);
