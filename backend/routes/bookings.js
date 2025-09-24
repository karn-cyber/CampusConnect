import express from 'express';
import { body, validationResult } from 'express-validator';
import BookingRequest from '../models/BookingRequest.js';
import { authenticateToken, requireAdminOrFaculty } from '../middleware/auth.js';

const router = express.Router();

// Get user's own booking requests
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { email: req.user.email };
    if (status) query.status = status;

    const bookings = await BookingRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BookingRequest.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// Get all booking requests (admin/faculty only)
router.get('/', authenticateToken, requireAdminOrFaculty, async (req, res) => {
  try {
    const { status, building, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (building) query.building = building;

    const bookings = await BookingRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BookingRequest.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// Get booking request by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await BookingRequest.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking request not found' 
      });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// Create new booking request
router.post('/', authenticateToken, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('studentId').trim().notEmpty().withMessage('Student ID is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('building').isIn(['A Block', 'C Block', 'Main Auditorium']).withMessage('Invalid building'),
  body('room').trim().notEmpty().withMessage('Room is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('timeSlot').trim().notEmpty().withMessage('Time slot is required'),
  body('purpose').trim().notEmpty().withMessage('Purpose is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors.array()
      });
    }

    const { building, room, date, timeSlot } = req.body;

    // Check if the room is already booked for that time slot
    const existingBooking = await BookingRequest.findOne({
      building,
      room,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Room is already booked for this time slot'
      });
    }

    // Create new booking request with user info from token
    const bookingData = {
      ...req.body,
      name: req.user.name,
      email: req.user.email,
      studentId: req.user.studentId,
      department: req.user.department
    };
    
    const bookingRequest = new BookingRequest(bookingData);
    await bookingRequest.save();

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      data: bookingRequest
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// Update booking status (approve/reject) - admin/faculty only
router.patch('/:id/status', authenticateToken, requireAdminOrFaculty, [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('reviewNotes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors.array()
      });
    }

    const { status, reviewNotes } = req.body;
    
    const booking = await BookingRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewedBy: req.user.name,
        reviewNotes,
        reviewedAt: new Date()
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking request not found' 
      });
    }

    res.json({
      success: true,
      message: `Booking request ${status} successfully`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// Delete booking request - admin only or user's own booking
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await BookingRequest.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking request not found' 
      });
    }

    // Allow admin or the user who made the booking to delete it
    if (req.user.role !== 'admin' && booking.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own booking requests'
      });
    }

    await BookingRequest.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking request not found' 
      });
    }

    res.json({
      success: true,
      message: 'Booking request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// Check availability for a specific room and date
router.get('/availability/:building/:room', authenticateToken, async (req, res) => {
  try {
    const { building, room } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    // Find all booked time slots for this room and date
    const bookedSlots = await BookingRequest.find({
      building,
      room,
      date: new Date(date),
      status: { $in: ['pending', 'approved'] }
    }).select('timeSlot');

    const bookedTimeSlots = bookedSlots.map(booking => booking.timeSlot);

    const allTimeSlots = [
      '08:30-09:00', '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
      '11:00-11:30', '11:30-12:00', '12:00-12:30', '12:30-13:00', '13:00-13:30',
      '13:30-14:00', '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00',
      '16:00-16:30', '16:30-17:00', '17:00-17:30', '17:30-18:00', '18:00-18:30',
      '18:30-19:00', '19:00-19:30', '19:30-20:00', '20:00-20:30', '20:30-21:00'
    ];

    const availableSlots = allTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));

    res.json({
      success: true,
      data: {
        building,
        room,
        date,
        availableSlots,
        bookedSlots: bookedTimeSlots
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

export default router;
