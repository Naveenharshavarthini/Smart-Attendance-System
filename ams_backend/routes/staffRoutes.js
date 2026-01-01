const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect routes with Staff role
router.post('/add-student', [authMiddleware, roleMiddleware(['Staff'])], staffController.addStudent);

module.exports = router;
