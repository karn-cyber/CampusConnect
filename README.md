# 🏫 Campus Connect

A comprehensive campus management system built with React and Node.js, designed to streamline university operations and enhance student experience.

![Campus Connect](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.0-61dafb.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🌟 Features

### 🔐 Authentication System
- **Secure Login/Signup** with JWT token-based authentication
- **Role-based Access Control** (Student/Admin)
- **Password Hashing** with bcrypt for security
- **Session Management** with automatic token refresh

### 🏢 Room Booking System
- **Interactive Room Display** grouped by campus buildings
- **Real-time Availability** checking
- **Booking Form** with comprehensive details
- **Time Slot Management** (9 AM - 9 PM slots)
- **Amenity Information** (WiFi, Projector, AC, etc.)

### 👨‍💼 Admin Panel
- **User Management** - View and manage all users
- **Booking Management** - Handle room booking requests
- **Room Management** - Add/edit campus rooms
- **Dashboard Analytics** - Overview of system usage

### 🎯 Upcoming Features
- 🧺 **Laundry Tracking** - Monitor washing machine status
- 🧠 **Psychologist Services** - Mental health appointment booking
- 💊 **Medical Services** - Campus healthcare management
- 📚 **Stationary Ordering** - Academic supplies ordering
- 🚗 **Car Pooling** - Ride sharing among students

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Vite** - Fast development server
- **CSS3** - Responsive styling with CSS variables

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/karn-cyber/CampusConnect.git
   cd CampusConnect
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create `backend/.env` file:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5001
   NODE_ENV=development
   ```

5. **Seed the Database**
   ```bash
   cd backend
   node seedDatabase.js
   cd ..
   ```

6. **Start the Application**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm start
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5001`

## 📁 Project Structure

```
CampusConnect/
├── 📁 backend/
│   ├── 📁 config/
│   │   └── database.js          # MongoDB connection
│   ├── 📁 middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── 📁 models/
│   │   ├── User.js              # User schema
│   │   ├── Room.js              # Room schema
│   │   └── BookingRequest.js    # Booking schema
│   ├── 📁 routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── users.js             # User management routes
│   │   ├── rooms.js             # Room management routes
│   │   └── bookings.js          # Booking management routes
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server
│   └── seedDatabase.js          # Database seeding script
├── 📁 src/
│   ├── 📁 components/
│   │   ├── Header.jsx           # Navigation header
│   │   ├── Login.jsx            # Login form
│   │   ├── Signup.jsx           # Registration form
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── RoomBooking.jsx      # Room booking interface
│   │   ├── AdminPanel.jsx       # Admin management panel
│   │   └── ProtectedRoute.jsx   # Route protection
│   ├── 📁 services/
│   │   └── api.js               # API service layer
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Global styles
│   └── main.jsx                 # Application entry point
├── package.json                 # Frontend dependencies
└── README.md                    # Project documentation
```

## 🔑 Default Admin Credentials

After running the seed script, use these credentials to access the admin panel:

**Admin Account 1:**
- Email: `mehak.m@rishihood.edu.in`
- Password: `mehakpass@campusconnect`

**Admin Account 2:**
- Email: `neelanshu.2024@nst.rishihood.edu.in`
- Password: `qwerty123456789`

## 📊 Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: 'student'),
  studentId: String,
  department: String,
  createdAt: Date
}
```

### Room Schema
```javascript
{
  roomNumber: String,
  building: String,
  capacity: Number,
  amenities: [String],
  location: String,
  isActive: Boolean
}
```

### Booking Request Schema
```javascript
{
  user: ObjectId (ref: User),
  room: ObjectId (ref: Room),
  building: String,
  roomNumber: String,
  date: Date,
  timeSlot: String,
  status: String (pending/approved/rejected),
  purpose: String,
  createdAt: Date
}
```

## 🏢 Campus Buildings & Rooms

The system includes **29 rooms** across **3 buildings**:

- **Academic Block A** - 10 rooms (101-110)
- **Academic Block B** - 10 rooms (201-210) 
- **Main Building** - 9 rooms (301-309)

Each room includes amenities like WiFi, projectors, AC, and various capacities (20-100 people).

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room (admin only)
- `GET /api/rooms/availability` - Check room availability

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking request
- `GET /api/bookings/all` - Get all bookings (admin only)
- `PUT /api/bookings/:id` - Update booking status (admin only)

### Users (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user role
- `DELETE /api/users/:id` - Delete user

## 🎨 UI Components

### Design System
- **Color Scheme**: Modern blue and white theme
- **Typography**: Clean, readable fonts
- **Icons**: Lucide React icon library
- **Layout**: Responsive grid system
- **Animations**: Smooth transitions and hover effects

### Responsive Design
- **Mobile-first** approach
- **Breakpoints**: 768px, 1024px, 1200px
- **Flexible layouts** with CSS Grid and Flexbox
- **Touch-friendly** interface elements

## 🔒 Security Features

- **Password Hashing** with bcrypt (12 salt rounds)
- **JWT Token** authentication with expiration
- **CORS Protection** configured for specific origins
- **Input Validation** on both frontend and backend
- **Protected Routes** with role-based access
- **Environment Variables** for sensitive data

## 🧪 Testing & Development

### Development Mode
```bash
# Frontend with hot reload
npm run dev

# Backend with nodemon
cd backend && npm run dev
```

### Production Build
```bash
npm run build
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`

### Backend (Railway/Heroku)
1. Set environment variables in dashboard
2. Deploy from GitHub repository
3. Ensure MongoDB Atlas is accessible

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 TODO

- [ ] Add email notifications for booking confirmations
- [ ] Implement real-time chat support
- [ ] Add calendar integration
- [ ] Mobile app development
- [ ] Payment gateway integration
- [ ] Multi-language support

## 🐛 Known Issues

- Room availability checking might have slight delays during peak hours
- Mobile view optimization for complex forms
- Database connection timeout handling

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Neelanshu** - *Initial work* - [karn-cyber](https://github.com/karn-cyber)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the excellent database service
- Lucide team for beautiful icons
- Open source community for inspiration

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact:

- Email: support@campusconnect.edu
- GitHub Issues: [Create Issue](https://github.com/karn-cyber/CampusConnect/issues)

---

<div align="center">
  <p>Made with ❤️ for university students</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
