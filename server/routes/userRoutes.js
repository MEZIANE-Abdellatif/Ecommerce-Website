const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  verifyEmail, 
  googleLogin, 
  updateUserAdminStatus,
  getAllUsers,
  deleteUser,
  updateUserRole
} = require('../controllers/userController');
const { protect, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin, validateProfileUpdate } = require('../middleware/validation');
const { registrationLimiter, authLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

// Public routes
router.post('/register', registrationLimiter, validateRegistration, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/google-login', authLimiter, googleLogin);
router.post('/verify-email', verifyEmail);
router.get('/verify-email', verifyEmail);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validateProfileUpdate, updateUserProfile);

// Admin routes (require admin or SuperAdmin)
router.get('/', protect, isAdmin, getAllUsers);

// User management routes (Admin can delete regular users, SuperAdmin can delete admins and regular users)
router.put('/:userId/admin-status', protect, isSuperAdmin, updateUserAdminStatus);
router.put('/:userId/role', protect, isAdmin, updateUserRole);
router.delete('/:userId', protect, isAdmin, deleteUser);

module.exports = router; 