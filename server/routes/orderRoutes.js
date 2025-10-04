const express = require('express');
const { createOrder, getAllOrders, getOrderById, getMyOrders, deleteOrder } = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Create new order (protected)
router.post('/', protect, createOrder);

// Get all orders (admin only)
router.get('/', protect, isAdmin, getAllOrders);

// Get logged in user orders (protected)
router.get('/myorders', protect, getMyOrders);

// Delete order by ID (admin only)
router.delete('/:id', protect, isAdmin, deleteOrder);

// Get order by ID (protected) - must be last to avoid conflicts
router.get('/:id', protect, getOrderById);

module.exports = router; 