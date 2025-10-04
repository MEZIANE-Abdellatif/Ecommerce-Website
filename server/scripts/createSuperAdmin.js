const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if SuperAdmin already exists
    const existingSuperAdmin = await User.findOne({ isSuperAdmin: true });
    if (existingSuperAdmin) {
      console.log('⚠️  SuperAdmin already exists:', existingSuperAdmin.email);
      process.exit(0);
    }

    // Create SuperAdmin
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'superadmin@example.com', // Change this to your desired email
      password: 'SuperAdmin123!', // Change this to your desired password
      isVerified: true,
      isAdmin: false, // SuperAdmin doesn't need isAdmin flag
      isSuperAdmin: true,
    });

    await superAdmin.save();
    console.log('✅ SuperAdmin created successfully!');
    console.log('📧 Email:', superAdmin.email);
    console.log('🔑 Password:', 'SuperAdmin123!');
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating SuperAdmin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createSuperAdmin(); 