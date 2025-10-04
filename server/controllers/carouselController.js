const CarouselSlide = require('../models/CarouselSlide');

// Get all carousel slides
const getAllSlides = async (req, res) => {
  try {
    const slides = await CarouselSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch (error) {
    console.error('Error fetching carousel slides:', error);
    res.status(500).json({ message: 'Failed to fetch carousel slides' });
  }
};

// Create a new carousel slide
const createSlide = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Validate required fields
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // Get the highest order number and add 1
    const lastSlide = await CarouselSlide.findOne().sort({ order: -1 });
    const newOrder = lastSlide ? lastSlide.order + 1 : 0;

    const slide = new CarouselSlide({
      imageUrl,
      order: newOrder
    });

    const savedSlide = await slide.save();
    res.status(201).json(savedSlide);
  } catch (error) {
    console.error('Error creating carousel slide:', error);
    res.status(500).json({ message: 'Failed to create carousel slide' });
  }
};

// Update a carousel slide
const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const slide = await CarouselSlide.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!slide) {
      return res.status(404).json({ message: 'Carousel slide not found' });
    }

    res.json(slide);
  } catch (error) {
    console.error('Error updating carousel slide:', error);
    res.status(500).json({ message: 'Failed to update carousel slide' });
  }
};

// Delete a carousel slide
const deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;
    
    const slide = await CarouselSlide.findByIdAndDelete(id);
    
    if (!slide) {
      return res.status(404).json({ message: 'Carousel slide not found' });
    }

    // Reorder remaining slides
    await CarouselSlide.updateMany(
      { order: { $gt: slide.order } },
      { $inc: { order: -1 } }
    );

    res.json({ message: 'Carousel slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting carousel slide:', error);
    res.status(500).json({ message: 'Failed to delete carousel slide' });
  }
};

// Reorder slides
const reorderSlides = async (req, res) => {
  try {
    const { slides } = req.body; // Array of { id, order }

    for (const slide of slides) {
      await CarouselSlide.findByIdAndUpdate(slide.id, { order: slide.order });
    }

    res.json({ message: 'Slides reordered successfully' });
  } catch (error) {
    console.error('Error reordering slides:', error);
    res.status(500).json({ message: 'Failed to reorder slides' });
  }
};

// Toggle slide active status
const toggleSlideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const slide = await CarouselSlide.findById(id);
    if (!slide) {
      return res.status(404).json({ message: 'Carousel slide not found' });
    }

    slide.isActive = !slide.isActive;
    await slide.save();

    res.json(slide);
  } catch (error) {
    console.error('Error toggling slide status:', error);
    res.status(500).json({ message: 'Failed to toggle slide status' });
  }
};

module.exports = {
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
  toggleSlideStatus
};
