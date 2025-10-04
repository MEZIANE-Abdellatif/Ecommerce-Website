const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
  toggleSlideStatus
} = require('../controllers/carouselController');

// Public route to get active slides (for frontend display)
router.get('/slides', getAllSlides);

// Protected routes (admin only)
router.post('/slides', protect, isAdmin, createSlide);
router.put('/slides/:id', protect, isAdmin, updateSlide);
router.delete('/slides/:id', protect, isAdmin, deleteSlide);
router.put('/slides/reorder', protect, isAdmin, reorderSlides);
router.put('/slides/:id/toggle', protect, isAdmin, toggleSlideStatus);

module.exports = router;



