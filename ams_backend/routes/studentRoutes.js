const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

// New routes for attendance
router.post('/clockin', studentController.clockIn);  // Route for clock-in
router.get('/:studentId/daily-attendance', studentController.getDailyAttendance);  // Route to get daily attendance


module.exports = router;
