const rateLimit = require('express-rate-limit');

// Rate limiting for authentication routes (login, google-login, resend-verification)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: 15 * 60,
    });
  },
});

// Rate limiting for registration (more lenient)
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 registration attempts per windowMs
  message: {
    error: 'Too many registration attempts, please try again later.',
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many registration attempts, please try again later.',
      retryAfter: 15 * 60,
    });
  },
});

// Rate limiting for email verification
const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per hour
  message: {
    error: 'Too many email verification requests, please try again later.',
    retryAfter: 60 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many email verification requests, please try again later.',
      retryAfter: 60 * 60,
    });
  },
});

module.exports = {
  authLimiter,
  registrationLimiter,
  emailVerificationLimiter,
}; 