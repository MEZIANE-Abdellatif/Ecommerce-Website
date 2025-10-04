const jwt = require('jsonwebtoken');
require('dotenv').config();

// Test JWT token
const testToken = (token) => {
  try {
    console.log('🔍 Testing JWT token...');
    console.log('Token length:', token ? token.length : 'No token');
    
    if (!token) {
      console.log('❌ No token provided');
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT Token is valid!');
    console.log('User ID:', decoded.id);
    console.log('Issued at:', new Date(decoded.iat * 1000).toISOString());
    console.log('Expires at:', new Date(decoded.exp * 1000).toISOString());
    console.log('Current time:', new Date().toISOString());
    
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      console.log('⚠️  Token has expired!');
    } else {
      console.log('✅ Token is still valid');
    }
    
  } catch (error) {
    console.error('❌ JWT Token verification failed:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      console.log('⚠️  Token expired at:', new Date(error.expiredAt).toISOString());
    } else if (error.name === 'JsonWebTokenError') {
      console.log('⚠️  Invalid token format');
    }
  }
};

// Test with a sample token if provided
if (process.argv[2]) {
  testToken(process.argv[2]);
} else {
  console.log('📝 Usage: node debugAuth.js <jwt_token>');
  console.log('🔍 This will test and decode your JWT token');
}



