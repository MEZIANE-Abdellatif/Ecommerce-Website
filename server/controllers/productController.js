const Product = require('../models/Product');

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const { category, sort, ...attributeFilters } = req.query;
    
    // Build query object
    const query = {};
    
    // Category filter
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    // Dynamic attribute filters
    for (const [key, value] of Object.entries(attributeFilters)) {
      if (value && value !== 'all') {
        query[`attributes.${key}`] = { $regex: new RegExp(`^${value}$`, 'i') };
      }
    }
    
    // Build sort object
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        case 'price-low':
          sortOptions = { price: 1 };
          break;
        case 'price-high':
          sortOptions = { price: -1 };
          break;
        case 'name-asc':
          sortOptions = { name: 1 };
          break;
        case 'name-desc':
          sortOptions = { name: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 }; // Default to newest
      }
    } else {
      sortOptions = { createdAt: -1 }; // Default to newest if no sort specified
    }
    
    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new product (admin only)
const createProduct = async (req, res) => {
  try {
    console.log('🟢 createProduct function called');
    console.log('User making request:', req.user);
    console.log('Received product data:', req.body);
    const { name, price, description, images, category, quantity, attributes } = req.body;

    // Validate required fields
    console.log('Validation check:', { name, price, description, category, quantity });
    if (!name || !price || !description || !category || quantity === undefined) {
      console.log('Validation failed - missing fields');
      console.log('Missing fields:', {
        name: !name,
        price: !price,
        description: !description,
        category: !category,
        quantity: quantity === undefined
      });
      return res.status(400).json({ 
        message: 'Name, price, description, category, and quantity are required fields' 
      });
    }

    // Validate price and quantity
    if (price <= 0 || quantity < 0) {
      return res.status(400).json({ 
        message: 'Price must be greater than 0 and quantity must be 0 or greater' 
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      images: images || [],
      category,
      countInStock: quantity,
      attributes: attributes || new Map(),
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Product creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a product (admin only)
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, images, category, quantity, attributes } = req.body;
    const productId = req.params.id;

    // Validate required fields
    if (!name || !price || !description || !category || quantity === undefined) {
      return res.status(400).json({ 
        message: 'Name, price, description, category, and quantity are required fields' 
      });
    }

    // Validate price and quantity
    if (price <= 0 || quantity < 0) {
      return res.status(400).json({ 
        message: 'Price must be greater than 0 and quantity must be 0 or greater' 
      });
    }

    // Check if product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        description,
        images: images || [],
        category,
        countInStock: quantity,
        attributes: attributes || new Map(),
      },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error('❌ Product update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product by ID (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}; 