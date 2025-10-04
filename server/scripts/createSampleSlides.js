const mongoose = require('mongoose');
const CarouselSlide = require('../models/CarouselSlide');
require('dotenv').config();

const createSampleSlides = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing slides
    await CarouselSlide.deleteMany({});
    console.log('🗑️ Cleared existing slides');

    // Create sample slides (image-only)
    const sampleSlides = [
      {
        order: 0,
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=600&fit=crop'
      },
      {
        order: 1,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&h=600&fit=crop'
      },
      {
        order: 2,
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=600&fit=crop'
      }
    ];

    // Insert slides
    const createdSlides = await CarouselSlide.insertMany(sampleSlides);
    console.log('✅ Created sample slides:', createdSlides.length);

    // Display created slides
    console.log('\n📋 Sample slides created:');
    createdSlides.forEach((slide, index) => {
      console.log(`${index + 1}. Slide ${slide.order + 1} - Image: ${slide.imageUrl.substring(0, 50)}...`);
    });

    console.log('\n🎉 Sample slides created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample slides:', error);
    process.exit(1);
  }
};

createSampleSlides();
