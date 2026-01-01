const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const attendanceController = require('../controllers/attendance.controller');

// Class Routes
router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
router.post('/', classController.createClass);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);

// Attendance Routes
router.post('/clock-in', attendanceController.clockIn);
router.post('/getattendance', attendanceController.getAttendance); // Add this line for getting attendance
router.post('/getAttendanceReport', attendanceController.getAttendanceReport);

module.exports = router;
