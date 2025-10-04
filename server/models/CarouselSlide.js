const mongoose = require('mongoose');

const carouselSlideSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
    default: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure order is unique
carouselSlideSchema.index({ order: 1 });

module.exports = mongoose.model('CarouselSlide', carouselSlideSchema);
