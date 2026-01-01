const express = require('express');
const connectDB = require('./config/db');
const app = express();
require('dotenv').config();
const cors = require('cors'); // Import cors
// app.use('/uploads', express.static('uploads'));
// Connect to database
connectDB();
// Middleware
app.use(cors({
    origin: 'http://localhost:4200',  // Allow only your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // Serve static files with CORS
  app.use('/uploads', express.static('uploads'));
  // Middleware
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));        // Login and Forgot Password
app.use('/api/admin', require('./routes/adminRoutes'));      // Admin routes for adding staff
app.use('/api/staff', require('./routes/staffRoutes'));      // Staff routes for adding students
app.use('/api/departments', require('./routes/departmentRoutes'));  // Other CRUD routes remain
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/tables', require('./routes/tableRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/', require('./controllers/timetableController'));
// Set up server
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
