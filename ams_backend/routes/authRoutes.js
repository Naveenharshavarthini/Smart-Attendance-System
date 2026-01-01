const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route for all users (admin, staff, student)
router.post('/login', authController.login);

// Forgot password route for all users
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;