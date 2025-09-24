import express from 'express';
import Room from '../models/Room.js';

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const { building, isActive = true } = req.query;
    
    const query = { isActive };
    if (building) query.building = building;

    const rooms = await Room.find(query).sort({ building: 1, roomNumber: 1 });

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// Get rooms by building
router.get('/building/:building', async (req, res) => {
  try {
    const { building } = req.params;
    
    const rooms = await Room.find({ 
      building, 
      isActive: true 
    }).sort({ roomNumber: 1 });

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ 
        success: false, 
        message: 'Room not found' 
      });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// Create new room (admin only)
router.post('/', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Room already exists in this building'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// Update room
router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ 
        success: false, 
        message: 'Room not found' 
      });
    }

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// Delete room
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    
    if (!room) {
      return res.status(404).json({ 
        success: false, 
        message: 'Room not found' 
      });
    }

    res.json({
      success: true,
      message: 'Room deleted successfully'
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
