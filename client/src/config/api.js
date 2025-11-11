// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/users/login`,
  REGISTER: `${API_BASE_URL}/api/users/register`,
  GOOGLE_LOGIN: `${API_BASE_URL}/api/users/google-login`,
  PROFILE: `${API_BASE_URL}/api/users/profile`,
  VERIFY_EMAIL: `${API_BASE_URL}/api/users/verify-email`,
  RESEND_VERIFICATION: `${API_BASE_URL}/api/users/resend-verification`,
  
  // Product endpoints
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
  PRODUCTS_BY_CATEGORY: (category) => `${API_BASE_URL}/api/products?category=${category}`,
  PRODUCTS_SORTED: (sort) => `${API_BASE_URL}/api/products?sort=${sort}`,
  
  // Order endpoints
  ORDERS: `${API_BASE_URL}/api/orders`,
  MY_ORDERS: `${API_BASE_URL}/api/orders/myorders`,
  ORDER_BY_ID: (id) => `${API_BASE_URL}/api/orders/${id}`,
  
  // Carousel endpoints
  CAROUSEL_SLIDES: `${API_BASE_URL}/api/carousel/slides`,
  CAROUSEL_SLIDE_BY_ID: (id) => `${API_BASE_URL}/api/carousel/slides/${id}`,
  
  // User management (admin)
  USERS: `${API_BASE_URL}/api/users`,
  USER_ROLE: (id) => `${API_BASE_URL}/api/users/${id}/role`,
  
  // Geocoding endpoints
  GEOCODE_SEARCH: `${API_BASE_URL}/api/geocode/search`,
  GEOCODE_DETAILS: `${API_BASE_URL}/api/geocode/details`,
};

export default API_BASE_URL;

