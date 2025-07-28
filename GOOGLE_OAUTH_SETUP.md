# Google OAuth Setup Guide

## Frontend Setup

1. **Get Google Client ID:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Set Application Type to "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `http://localhost:3000` (if using different port)
   - Copy the Client ID

2. **Update Frontend:**
   - Open `client/src/main.jsx`
   - Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID

## Backend Setup

1. **Create .env file in server directory:**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=someSuperSecretKey123!
   GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
   ```

2. **Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID**

## Features Added

### Frontend:
- ✅ Google OAuth provider setup
- ✅ Google login button component
- ✅ Integration with Login and Register pages
- ✅ Error handling for Google authentication
- ✅ Automatic redirect after successful login

### Backend:
- ✅ Google token verification
- ✅ Automatic user creation for new Google users
- ✅ JWT token generation for Google users
- ✅ New `/api/users/google-login` endpoint

## How It Works

1. **User clicks "Continue with Google"**
2. **Google OAuth popup opens**
3. **User authenticates with Google**
4. **Frontend sends Google token to backend**
5. **Backend verifies token with Google**
6. **Backend creates/finds user and generates JWT**
7. **User is logged in and redirected to profile**

## Security Features

- ✅ Google token verification on backend
- ✅ Secure JWT token generation
- ✅ User data validation
- ✅ Error handling for failed authentication

## Next Steps

1. Get your Google Client ID from Google Cloud Console
2. Update the Client ID in both frontend and backend
3. Test the Google login functionality
4. Consider adding other OAuth providers (Facebook, Twitter, etc.)

## Troubleshooting

- **"Invalid Client ID"**: Make sure you're using the correct Google Client ID
- **"Origin not allowed"**: Add your domain to authorized origins in Google Console
- **"Token verification failed"**: Check that your backend has the correct Google Client ID 