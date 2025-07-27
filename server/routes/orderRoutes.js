const express = require('express');
const { createOrder, getOrderById, getMyOrders, deleteOrder } = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Create new order (protected)
router.post('/', protect, createOrder);

// Get logged in user orders (protected)
router.get('/myorders', protect, getMyOrders);

// Get order by ID (protected)
router.get('/:id', protect, getOrderById);

// Delete order by ID (admin only)
router.delete('/:id', protect, isAdmin, deleteOrder);

module.exports = router; 