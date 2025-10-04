const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test users data
    const testUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        isVerified: true,
        isAdmin: false,
        isSuperAdmin: false,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'Password123!',
        isVerified: true,
        isAdmin: false,
        isSuperAdmin: false,
      },
      {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        password: 'Password123!',
        isVerified: true,
        isAdmin: false,
        isSuperAdmin: false,
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'Password123!',
        isVerified: true,
        isAdmin: false,
        isSuperAdmin: false,
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'Password123!',
        isVerified: true,
        isAdmin: false,
        isSuperAdmin: false,
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Admin123!',
        isVerified: true,
        isAdmin: true,
        isSuperAdmin: false,
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'Manager123!',
        isVerified: true,
        isAdmin: true,
        isSuperAdmin: false,
      },
      {
        name: 'Unverified User',
        email: 'unverified@example.com',
        password: 'Password123!',
        isVerified: false,
        isAdmin: false,
        isSuperAdmin: false,
      },
      {
        name: 'Premium User',
        email: 'premium@example.com',
        password: 'Premium123!',
        isVerified: true,
        isAdmin: false,
        isSuperAdmin: false,
      },
    ];

    console.log('🔧 Creating test users...');

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Create user
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }

    console.log('\n📊 Test Users Summary:');
    console.log('=====================');
    
    const allUsers = await User.find({}).select('name email isVerified isAdmin isSuperAdmin createdAt');
    allUsers.forEach(user => {
      const role = user.isSuperAdmin ? 'SuperAdmin' : user.isAdmin ? 'Admin' : 'User';
      const status = user.isVerified ? 'Verified' : 'Unverified';
      console.log(`👤 ${user.name} (${user.email}) - ${role} - ${status}`);
    });

    console.log(`\n🎉 Successfully created ${testUsers.length} test users!`);
    console.log('\n📝 Login Credentials:');
    console.log('===================');
    console.log('Regular Users:');
    console.log('- Email: john@example.com, Password: Password123!');
    console.log('- Email: jane@example.com, Password: Password123!');
    console.log('- Email: bob@example.com, Password: Password123!');
    console.log('- Email: alice@example.com, Password: Password123!');
    console.log('- Email: charlie@example.com, Password: Password123!');
    console.log('- Email: premium@example.com, Password: Premium123!');
    console.log('\nAdmin Users:');
    console.log('- Email: admin@example.com, Password: Admin123!');
    console.log('- Email: manager@example.com, Password: Manager123!');
    console.log('\nSpecial Users:');
    console.log('- Email: unverified@example.com, Password: Password123! (Unverified)');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createTestUsers(); 