import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  building: {
    type: String,
    required: true,
    enum: ['A Block', 'C Block', 'Main Auditorium']
  },
  roomNumber: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  amenities: [{
    type: String,
    enum: ['Projector', 'WiFi', 'Whiteboard', 'AC', 'Sound System', 'Smart Board', 'Video Conferencing']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for unique building-room combination
roomSchema.index({ building: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model('Room', roomSchema);
