 const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/products (admin only) - Define this first to avoid conflicts
router.post('/', protect, isAdmin, createProduct);

// GET /api/products
router.get('/', getAllProducts);

// GET /api/products/:id - Define this last to avoid conflicts
router.get('/:id', getProductById);

// PUT /api/products/:id (admin only) - Update product
router.put('/:id', protect, isAdmin, updateProduct);

// DELETE /api/products/:id (admin only)
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router; 