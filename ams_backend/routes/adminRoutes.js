const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect routes with Admin role
router.post('/add-staff', [authMiddleware, roleMiddleware(['Admin'])], adminController.addStaff);

module.exports = router;
