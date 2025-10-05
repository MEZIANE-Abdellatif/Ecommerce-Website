const rateLimit = require('express-rate-limit');

// Rate limiting configurations
const rateLimitConfig = {
  // General API rate limiting
  general: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: 15 * 60, // 15 minutes in seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 15 * 60,
      });
    },
  }),

  // Stricter rate limiting for authentication routes
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
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
  }),

  // Rate limiting for email verification
  emailVerification: rateLimit({
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
  }),
};

// CORS configuration
const corsConfig = {
  origin: process.env.CLIENT_URL || 'https://ecommerce-website-topaz-sigma.vercel.app',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['X-Total-Count'],
};

// Helmet configuration
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net",
      ],
      scriptSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://www.googletagmanager.com",
      ],
      frameSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://www.google.com",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:",
      ],
      connectSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://www.googleapis.com",
      ],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
};

// JWT configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  options: {
    expiresIn: '30d',
    issuer: 'e-commerce-api',
    audience: 'e-commerce-client',
    algorithm: 'HS256',
  },
};

// Password validation rules
const passwordRules = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
};

// Input sanitization rules
const sanitizationRules = {
  maxStringLength: 1000,
  maxArrayLength: 100,
  maxObjectDepth: 10,
  allowedTags: [], // No HTML tags allowed
  allowedAttributes: {}, // No HTML attributes allowed
};

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: 'strict',
  },
};

module.exports = {
  rateLimitConfig,
  corsConfig,
  helmetConfig,
  jwtConfig,
  passwordRules,
  sanitizationRules,
  sessionConfig,
}; 