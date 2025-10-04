const jwt = require('jsonwebtoken');
require('dotenv').config();

// Test JWT token decoding
const testJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT Token decoded successfully:');
    console.log('User ID:', decoded.id);
    console.log('Email:', decoded.email);
    console.log('Full decoded token:', JSON.stringify(decoded, null, 2));
  } catch (error) {
    console.error('❌ JWT Token verification failed:', error.message);
  }
};

// If a token is provided as command line argument, test it
if (process.argv[2]) {
  console.log('🔍 Testing JWT token:', process.argv[2]);
  testJWT(process.argv[2]);
} else {
  console.log('📝 Usage: node testJWT.js <jwt_token>');
  console.log('🔍 This will decode and show the contents of the JWT token');
}



