const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createSampleOrders = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Get a user (assuming there's at least one user)
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found. Please create a user first.');
      return;
    }
    
    console.log(`👤 Found user: ${user.name} (${user.email})`);
    
    // Get some products
    const products = await Product.find().limit(3);
    if (products.length === 0) {
      console.log('❌ No products found. Please add products first.');
      return;
    }
    
    console.log(`📦 Found ${products.length} products`);
    
    // Clear existing orders
    await Order.deleteMany({});
    console.log('🗑️ Cleared existing orders');
    
    // Create sample orders
    const sampleOrders = [
      {
        user: user._id,
        orderItems: [
          {
            name: products[0].name,
            qty: 2,
            image: products[0].image || 'https://source.unsplash.com/300x200/?skincare',
            price: products[0].price,
            product: products[0]._id,
          },
          {
            name: products[1]?.name || 'Sample Product 2',
            qty: 1,
            image: products[1]?.image || 'https://source.unsplash.com/300x200/?skincare',
            price: products[1]?.price || 29.99,
            product: products[1]?._id || products[0]._id,
          }
        ],
        shippingAddress: {
          address: '123 Beauty Street',
          city: 'Cosmetic City',
          postalCode: '12345',
          country: 'United States',
        },
        paymentMethod: 'Credit Card',
        totalPrice: (products[0].price * 2) + (products[1]?.price || 29.99),
        isPaid: true,
        paidAt: new Date('2024-01-15'),
        isDelivered: true,
        deliveredAt: new Date('2024-01-18'),
      },
      {
        user: user._id,
        orderItems: [
          {
            name: products[2]?.name || 'Sample Product 3',
            qty: 1,
            image: products[2]?.image || 'https://source.unsplash.com/300x200/?makeup',
            price: products[2]?.price || 49.99,
            product: products[2]?._id || products[0]._id,
          }
        ],
        shippingAddress: {
          address: '456 Fashion Avenue',
          city: 'Style City',
          postalCode: '54321',
          country: 'United States',
        },
        paymentMethod: 'PayPal',
        totalPrice: products[2]?.price || 49.99,
        isPaid: true,
        paidAt: new Date('2024-01-10'),
        isDelivered: false,
      }
    ];
    
    // Create orders
    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${createdOrders.length} sample orders`);
    
    // Display order IDs for frontend use
    console.log('\n📋 Order IDs for frontend:');
    createdOrders.forEach((order, index) => {
      console.log(`Order ${index + 1}: ${order._id}`);
    });
    
    console.log('\n🎉 Sample orders created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating sample orders:', error);
  } finally {
    mongoose.connection.close();
  }
};

createSampleOrders();
