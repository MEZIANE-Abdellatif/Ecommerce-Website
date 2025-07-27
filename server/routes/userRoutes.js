const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, updateUserAdminStatus } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile (protected)
router.get('/profile', protect, getUserProfile);

// Update user profile (protected)
router.put('/profile', protect, updateUserProfile);

// Update user admin status (admin only)
router.put('/:id/admin', protect, isAdmin, updateUserAdminStatus);

module.exports = router; 