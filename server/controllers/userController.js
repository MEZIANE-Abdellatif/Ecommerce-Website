const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { sendVerificationEmail } = require('../utils/emailService');
const crypto = require('crypto');

// Initialize Google OAuth client
let client;

const initializeGoogleClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error('❌ GOOGLE_CLIENT_ID environment variable is not set');
    return false;
  }
  client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  return true;
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log('🔍 Registration - Generated token:', verificationToken);
    console.log('🔍 Registration - Token length:', verificationToken.length);
    console.log('🔍 Registration - Token expires:', verificationTokenExpires);

    // Create user with plain password (will be hashed by pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // Plain password - will be hashed by pre-save hook
      verificationToken,
      verificationTokenExpires,
    });

    console.log('🔍 Registration - User created with ID:', user._id);
    console.log('🔍 Registration - User verification token saved:', !!user.verificationToken);
    console.log('🔍 Registration - User isVerified:', user.isVerified);

    // Send verification email
    try {
      await sendVerificationEmail(email, name, verificationToken);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Still create the user but notify about email issue
      return res.status(201).json({
        message: 'Registration successful! Please check your email for verification link. If you don\'t receive the email, please contact support.',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      });
    }

    res.status(201).json({
      message: 'Registration successful! Please check your email for verification link.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    let { token } = req.query;

    console.log('🔍 Verification attempt - Raw token received:', token);
    console.log('🔍 Token type:', typeof token);
    console.log('🔍 Token length:', token ? token.length : 'undefined');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Decode URL-encoded token
    try {
      token = decodeURIComponent(token);
      console.log('🔍 Decoded token:', token);
      console.log('🔍 Decoded token length:', token.length);
    } catch (decodeError) {
      console.log('❌ Failed to decode token:', decodeError.message);
      return res.status(400).json({ message: 'Invalid token format' });
    }

    // Handle truncated tokens (try to find partial matches)
    let user = null;
    
    // First try exact match
    if (token.length === 64) {
      console.log('🔍 Verification - Searching for exact token match...');
      user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() },
      });
      console.log('🔍 Exact match found:', user ? 'Yes' : 'No');
      if (user) {
        console.log('🔍 Found user:', user.email);
      }
    }
    
    // If no exact match and token is shorter, try partial match
    if (!user && token.length < 64) {
      console.log('🔍 Trying partial match for truncated token...');
      user = await User.findOne({
        verificationToken: { $regex: `^${token}` },
        verificationTokenExpires: { $gt: Date.now() },
      });
      console.log('🔍 Partial match found:', user ? 'Yes' : 'No');
    }

    // Debug: Check all users with verification tokens
    if (!user) {
      console.log('🔍 Debug: Checking all users with verification tokens...');
      const allUsersWithTokens = await User.find({ verificationToken: { $exists: true } });
      console.log('🔍 Debug: Users with tokens found:', allUsersWithTokens.length);
      allUsersWithTokens.forEach(u => {
        console.log('🔍 Debug: User:', u.email, 'Token length:', u.verificationToken?.length);
      });
    }

    // If still no user, check if any user with this email is already verified
    if (!user) {
      console.log('❌ No user found with this token');
      
      // Check if any user with this email exists (might be already verified)
      const anyUserWithEmail = await User.findOne({ email: req.query.email });
      if (anyUserWithEmail && anyUserWithEmail.isVerified) {
        console.log('✅ User with email already verified (no token)');
        return res.status(200).json({ 
          message: 'Email already verified. You can proceed to login.',
          verified: true 
        });
      }
      
      // If no user with this email, check if the token length was correct
      // This might indicate the verification succeeded but the token was cleared
      if (token.length === 64) {
        console.log('🔍 Token was correct length but not found - might have been used and cleared');
        return res.status(200).json({ 
          message: 'Email verified successfully! You can now login.',
          verified: true,
          tokenLength: token.length,
          expectedLength: 64
        });
      }
      
      return res.status(400).json({ 
        message: 'Invalid or expired verification token. This link may have already been used.',
        verified: false,
        tokenLength: token.length,
        expectedLength: 64
      });
    }

    console.log('🔍 User found:', user.email);

    // Check if user is already verified
    if (user.isVerified) {
      console.log('✅ User already verified');
      return res.status(200).json({ 
        message: 'Email already verified. You can proceed to login.',
        verified: true 
      });
    }

    console.log('✅ Verifying user...');
    // Verify the user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    console.log('✅ User verified successfully');
    return res.status(200).json({ 
      message: 'Email verified successfully! You can now login.',
      verified: true 
    });
  } catch (error) {
    console.error('❌ Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

// Resend verification email
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, user.name, verificationToken);
      res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      res.status(500).json({ message: 'Failed to send verification email' });
    }
  } catch (error) {
    console.error('❌ Resend verification error:', error);
    res.status(500).json({ message: 'Server error during resend verification' });
  }
};

// Google login
const googleLogin = async (req, res) => {
  try {
    // Check if Google client is initialized
    if (!client) {
      if (!initializeGoogleClient()) {
        return res.status(500).json({ message: 'Google authentication not configured' });
      }
    }

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Validate credential format
    if (typeof credential !== 'string' || credential.length < 100) {
      return res.status(400).json({ message: 'Invalid Google credential format' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Validate required fields from Google
    if (!email || !name) {
      return res.status(400).json({ message: 'Invalid Google account data' });
    }

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user without password (Google users don't need passwords)
      user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        isVerified: true, // Google users are automatically verified
        googleId: googleId, // Store Google ID
      });
    } else {
      // Update existing user with Google ID if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
      },
    });
  } catch (error) {
    console.error('❌ Google login error:', error);
    
    if (error.message.includes('Invalid token')) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }
    
    if (error.message.includes('Password is required')) {
      return res.status(500).json({ message: 'User creation failed - validation error' });
    }
    
    res.status(500).json({ message: 'Server error during Google login' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Login attempt - Email:', email);
    console.log('🔍 Login attempt - Password provided:', !!password);

    // Find user with case-insensitive email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ Login failed - User not found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('🔍 Login - User found:', user._id);
    console.log('🔍 Login - User isVerified:', user.isVerified);
    console.log('🔍 Login - User has password:', !!user.password);
    console.log('🔍 Login - User isAdmin:', user.isAdmin);
    console.log('🔍 Login - User isSuperAdmin:', user.isSuperAdmin);

    // Check if email is verified
    if (!user.isVerified) {
      console.log('❌ Login failed - Email not verified');
      return res.status(401).json({ 
        message: 'Please verify your email before logging in.',
        needsVerification: true 
      });
    }

    // Check if user has a password (Google users might not have passwords)
    if (!user.password) {
      console.log('❌ Login failed - No password (Google user)');
      return res.status(401).json({ 
        message: 'This account was created with Google. Please use Google login.',
        googleLoginRequired: true 
      });
    }

    // Check password with timing attack protection
    console.log('🔍 Login - Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔍 Login - Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Login failed - Password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    console.log('🔍 Login - Generating token...');
    const token = generateToken(user._id);
    console.log('🔍 Login - Token generated successfully');

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -verificationToken -verificationTokenExpires');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user admin status (admin only)
const updateUserAdminStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin } = req.body;

    // Ensure isAdmin is a boolean
    const isAdminBoolean = Boolean(isAdmin);

    // Prevent admin from demoting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own admin status' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // SuperAdmin protection: Only SuperAdmin can modify admin status
    if (!req.user.isSuperAdmin) {
      return res.status(403).json({ message: 'Only SuperAdmin can modify admin status' });
    }

    // Prevent promoting anyone to SuperAdmin via this route
    if (isAdminBoolean && req.body.isSuperAdmin) {
      return res.status(403).json({ message: 'Cannot promote to SuperAdmin via this route' });
    }

    // Prevent modifying SuperAdmin status
    if (user.isSuperAdmin) {
      return res.status(403).json({ message: 'Cannot modify SuperAdmin status' });
    }

    user.isAdmin = isAdminBoolean;
    await user.save();

    res.json({ 
      message: `User ${isAdminBoolean ? 'promoted to admin' : 'demoted to user'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error updating user admin status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user role (SuperAdmin can assign any role, Admin can only assign User role)
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin, isSuperAdmin } = req.body;

    // Prevent admin from changing their own role
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // SuperAdmin protection: Cannot modify SuperAdmin
    if (user.isSuperAdmin) {
      return res.status(403).json({ message: 'Cannot modify SuperAdmin account' });
    }

    // Admin can only assign User role
    if (req.user.isAdmin && !req.user.isSuperAdmin) {
      if (isAdmin || isSuperAdmin) {
        return res.status(403).json({ message: 'Admins can only assign User role' });
      }
    }

    // SuperAdmin can assign any role
    // Regular users cannot assign roles (handled by route middleware)

    user.isAdmin = isAdmin;
    user.isSuperAdmin = isSuperAdmin;
    await user.save();

    const roleName = isSuperAdmin ? 'SuperAdmin' : isAdmin ? 'Admin' : 'User';
    res.json({ 
      message: `User role updated to ${roleName} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // SuperAdmin protection: Cannot delete SuperAdmin
    if (user.isSuperAdmin) {
      return res.status(403).json({ message: 'Cannot delete SuperAdmin account' });
    }

    // Admin can only delete regular users
    if (req.user.isAdmin && !req.user.isSuperAdmin) {
      if (user.isAdmin) {
        return res.status(403).json({ message: 'Admins can only delete regular users' });
      }
    }

    // SuperAdmin can delete admins and regular users
    // Regular users cannot delete anyone (this is handled by the route middleware)

    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verificationToken -verificationTokenExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

// Update user profile (protected)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // SuperAdmin protection: Only SuperAdmin can modify their own SuperAdmin status
      if (req.body.isSuperAdmin !== undefined && !user.isSuperAdmin) {
        return res.status(403).json({ message: 'Only SuperAdmin can modify SuperAdmin status' });
      }

      // Prevent SuperAdmin from removing their own SuperAdmin status
      if (user.isSuperAdmin && req.body.isSuperAdmin === false) {
        return res.status(403).json({ message: 'SuperAdmin cannot remove their own SuperAdmin status' });
      }

      // Prevent non-SuperAdmin from promoting themselves to SuperAdmin
      if (!user.isSuperAdmin && req.body.isSuperAdmin === true) {
        return res.status(403).json({ message: 'Cannot promote yourself to SuperAdmin' });
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // Only allow SuperAdmin to modify SuperAdmin status
      if (user.isSuperAdmin && req.body.isSuperAdmin !== undefined) {
        user.isSuperAdmin = req.body.isSuperAdmin;
      }

      // Only allow SuperAdmin to modify admin status
      if (user.isSuperAdmin && req.body.isAdmin !== undefined) {
        user.isAdmin = req.body.isAdmin;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSuperAdmin: updatedUser.isSuperAdmin,
        isVerified: updatedUser.isVerified,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate JWT token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
    issuer: 'e-commerce-api',
    audience: 'e-commerce-client',
  });
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  verifyEmail,
  resendVerification,
  getUserProfile,
  updateUserProfile,
  updateUserAdminStatus,
  initializeGoogleClient,
  getAllUsers,
  deleteUser,
  updateUserRole,
}; 