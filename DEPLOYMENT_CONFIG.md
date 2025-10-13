# Deployment Configuration Guide

## ✅ Changes Completed

### 1. API Configuration Centralized
- Created `client/src/config/api.js` with environment-aware API endpoints
- All 23 frontend files now use `API_ENDPOINTS` or `API_BASE_URL`
- No more hardcoded URLs in the codebase

### 2. Environment Variables Setup

#### Local Development
**Client `.env` file created:**
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=270228367132-5urh4v5tq8omioruufsaktcg7r5l58nf.apps.googleusercontent.com
VITE_CLOUDINARY_CLOUD_NAME=dbock6hhb
```

**Server `.env` file (ensure these are set):**
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=270228367132-5urh4v5tq8omioruufsaktcg7r5l58nf.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. CORS Configuration Updated
- Backend now supports multiple origins:
  - `http://localhost:5173` (local development)
  - `http://localhost:3000` (alternative local port)
  - `https://ecommerce-website-topaz-sigma.vercel.app` (Vercel)
  - `https://mazzinka.com` (production domain)
  - `https://ecommerce-website-iwrz.onrender.com` (Render backend)

## 🚀 Production Deployment

### Vercel (Frontend)
Set these environment variables in your Vercel dashboard:

```
VITE_API_URL=https://ecommerce-website-iwrz.onrender.com
VITE_GOOGLE_CLIENT_ID=270228367132-5urh4v5tq8omioruufsaktcg7r5l58nf.apps.googleusercontent.com
VITE_CLOUDINARY_CLOUD_NAME=dbock6hhb
```

### Render (Backend)
Set these environment variables in your Render dashboard:

```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://mazzinka.com
MONGO_URI=your_production_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
GOOGLE_CLIENT_ID=270228367132-5urh4v5tq8omioruufsaktcg7r5l58nf.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

## 🧪 Testing

### Local Testing
1. ✅ Backend running on `http://localhost:5000`
2. ✅ Frontend running on `http://localhost:5173`
3. ✅ CORS properly configured
4. ✅ All API calls use environment variables

### Production Testing
After deployment, verify:
- Frontend can access backend API
- CORS allows requests from your domain
- All API endpoints respond correctly

## 📝 Files Modified

### Created:
- `client/src/config/api.js` - Centralized API configuration

### Updated (23 files):
- All page components (Home, Login, Register, Dashboard, etc.)
- All product pages (Products, Makeup, Skincare, Haircare, Fragrance)
- All feature pages (BestSellers, NewArrivals, DiscountProducts)
- All order pages (Checkout, MyOrders, OrderDetails, PaymentMethod)
- All user pages (Profile, EditProfile, VerifyEmail)
- Components (GoogleLogin, HeroCarousel)
- Server CORS configuration (`server/index.js`)

## 🎯 Benefits

✅ **Single source of truth** for API URLs  
✅ **Environment-aware** - automatically uses correct URLs  
✅ **No code changes** needed between environments  
✅ **CORS properly configured** for all domains  
✅ **Easy to maintain** and update  

## 🔧 Troubleshooting

If you encounter CORS errors in production:
1. Verify `VITE_API_URL` is set in Vercel
2. Verify `CLIENT_URL` is set in Render
3. Check that your domain is in the `allowedOrigins` array in `server/index.js`
4. Clear browser cache and try again

## 📌 Important Notes

- The `.env` files are gitignored and won't be committed
- Environment variables must be set separately in Vercel and Render
- Local development uses `localhost` URLs
- Production uses your deployed URLs
- The app will work seamlessly in both environments
