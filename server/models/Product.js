const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['makeup', 'skincare', 'haircare', 'fragrance'],
    lowercase: true,
  },
  attributes: {
    type: Map,
    of: String,
    default: new Map(),
  },
  countInStock: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    default: [],
  },
  // Keep the old image field for backward compatibility
  image: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Category-specific attribute validation
const categoryAttributes = {
  makeup: {
    skinPart: ['eyes', 'lips', 'face', 'nails'],
    productType: ['mascara', 'lipstick', 'lipgloss', 'eyeshadow', 'foundation', 'concealer', 'blush', 'eyeliner', 'nailpolish']
  },
  skincare: {
    skinType: ['normal', 'oily', 'dry', 'combination', 'sensitive'],
    concern: ['acne', 'aging', 'dryness', 'sensitivity', 'dark_spots', 'fine_lines', 'hydration']
  },
  haircare: {
    hairType: ['oily_scalp', 'dry_hair', 'curly', 'damaged', 'straight', 'fine', 'thick', 'color_treated'],
    productType: ['shampoo', 'conditioner', 'mask', 'serum', 'oil', 'spray']
  },
  fragrance: {
    fragranceFamily: ['floral', 'woody', 'citrus', 'oriental', 'fresh', 'gourmand', 'aquatic'],
    concentration: ['EDT', 'EDP', 'parfum', 'cologne']
  }
};

// Validation middleware
productSchema.pre('validate', function(next) {
  const category = this.category?.toLowerCase();
  const attributes = this.attributes || new Map();
  
  if (category && categoryAttributes[category]) {
    const allowedAttributes = categoryAttributes[category];
    
    // Check if all attributes are valid for this category
    for (const [key, value] of attributes) {
      if (!allowedAttributes[key]) {
        return next(new Error(`Invalid attribute '${key}' for category '${category}'`));
      }
      
      if (!allowedAttributes[key].includes(value)) {
        return next(new Error(`Invalid value '${value}' for attribute '${key}' in category '${category}'`));
      }
    }
  }
  
  next();
});

module.exports = mongoose.model('Product', productSchema); 