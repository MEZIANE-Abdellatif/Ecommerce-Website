const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  updateUserAdminStatus,
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin only routes
router.put('/:id/admin', protect, isAdmin, updateUserAdminStatus);

module.exports = router; 