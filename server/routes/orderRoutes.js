const express = require('express');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getMyOrders,
  deleteOrder,
  createPaymentIntent,
  stripeWebhook,
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Stripe webhook — uses express.raw; order router mounted before express.json() in index.js
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// JSON body for all other order routes (mount point is before global express.json())
router.use(express.json({ limit: '10mb' }));

// Create new order (protected)
router.post('/', protect, createOrder);

// Get all orders (admin only)
router.get('/', protect, isAdmin, getAllOrders);

// Get logged in user orders (protected)
router.get('/myorders', protect, getMyOrders);

// Delete order by ID (admin only)
router.delete('/:id', protect, isAdmin, deleteOrder);

// Create Stripe PaymentIntent for an existing order (protected)
router.post('/:id/create-payment-intent', protect, createPaymentIntent);

// Get order by ID (protected) - must be last to avoid conflicts
router.get('/:id', protect, getOrderById);

module.exports = router; 