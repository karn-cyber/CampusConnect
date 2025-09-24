import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from './models/Room.js';
import User from './models/User.js';
import process from 'process';

dotenv.config();

const roomsData = [
  // A Block Rooms
  { building: 'A Block', roomNumber: '401', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '402', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '403', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '404', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '405', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '406', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '407', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '408', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '409', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '410', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '411', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '303', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '304', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '314', capacity: 150, location: 'Academic Building A - Mini Auditorium', amenities: ['Projector', 'WiFi', 'Sound System', 'AC', 'Smart Board'] },
  { building: 'A Block', roomNumber: '501', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '502', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '503', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '504', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '505', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '506', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '507', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'A Block', roomNumber: '508', capacity: 120, location: 'Academic Building A', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },

  // C Block Rooms
  { building: 'C Block', roomNumber: '101', capacity: 120, location: 'Academic Building C', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'C Block', roomNumber: '102', capacity: 120, location: 'Academic Building C', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'C Block', roomNumber: '201', capacity: 120, location: 'Academic Building C', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'C Block', roomNumber: '202', capacity: 120, location: 'Academic Building C', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'C Block', roomNumber: '301', capacity: 120, location: 'Academic Building C', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },
  { building: 'C Block', roomNumber: '302', capacity: 120, location: 'Academic Building C', amenities: ['Projector', 'WiFi', 'Whiteboard', 'AC'] },

  // Main Auditorium
  { building: 'Main Auditorium', roomNumber: 'Auditorium', capacity: 350, location: 'Central Campus - Main Auditorium', amenities: ['Projector', 'WiFi', 'Sound System', 'AC', 'Smart Board', 'Video Conferencing'] }
];

// Default admin users
const defaultAdmins = [
  {
    name: 'Mehak M',
    email: 'mehak.m@rishihood.edu.in',
    password: 'mehakpass@campusconnect', // This will be hashed automatically
    studentId: 'ADMIN001',
    department: 'Administration',
    role: 'admin'
  },
  {
    name: 'Neelanshu',
    email: 'neelanshu.2024@nst.rishihood.edu.in',
    password: 'qwerty123456789', // This will be hashed automatically
    studentId: 'ADMIN002',
    department: 'Administration',
    role: 'admin'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Room.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Insert rooms
    await Room.insertMany(roomsData);
    console.log(`✅ Successfully seeded ${roomsData.length} rooms`);

    // Create default admin users
    for (const adminData of defaultAdmins) {
      const adminExists = await User.findOne({ email: adminData.email });
      if (!adminExists) {
        const admin = new User(adminData);
        await admin.save();
        console.log(`✅ Created admin user: ${adminData.name}`);
        console.log(`📧 Admin Email: ${adminData.email}`);
        console.log(`🔑 Admin Password: ${adminData.password}`);
      } else {
        console.log(`ℹ️ Admin user ${adminData.email} already exists`);
      }
    }

    // Close connection
    await mongoose.connection.close();
    console.log('💾 Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
