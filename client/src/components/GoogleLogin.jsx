import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GoogleLoginButton({ onSuccess, onError }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    if (isLoading) return; // Prevent multiple requests
    
    setIsLoading(true);
    try {
      // Send the Google token to your backend
      const response = await axios.post('http://localhost:5000/api/users/google-login', {
        credential: credentialResponse.credential,
      });

      // Store the token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Redirect to profile page
      navigate('/profile');
    } catch (error) {
      console.error('Google login error:', error);
      
      // Handle network errors and aborted requests
      if (error.code === 'ERR_NETWORK' || error.message?.includes('aborted')) {
        if (onError) {
          onError('Network error. Please try again.');
        }
        return;
      }
      
      if (onError) {
        onError(error.response?.data?.message || 'Google login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    setIsLoading(false);
    
    // Suppress harmless FedCM AbortError warnings
    if (error?.message?.includes('AbortError') || 
        error?.message?.includes('FedCM') ||
        error?.message?.includes('aborted') ||
        error?.message?.includes('signal is aborted')) {
      console.log('Google login aborted - this is normal behavior');
      return;
    }
    
    // Suppress other harmless Google errors
    if (error?.message?.includes('popup_closed') ||
        error?.message?.includes('access_denied') ||
        error?.message?.includes('immediate_failed')) {
      console.log('Google login cancelled by user');
      return;
    }
    
    console.error('Google login failed:', error);
    if (onError) {
      onError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="w-full">
      {isLoading && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center px-4 py-2 text-sm text-blue-600">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Google login...
          </div>
        </div>
      )}
      
      {/* Custom Google Button - Hidden Google Component */}
      <div className="hidden">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width="100%"
          cancel_on_tap_outside={true}
          context="signin"
          disabled={isLoading}
        />
      </div>
      
      {/* Custom Styled Button */}
      <button
        onClick={() => {
          // Trigger the hidden Google button
          const googleButton = document.querySelector('[data-testid="google-login-button"]') || 
                              document.querySelector('div[role="button"]');
          if (googleButton) {
            googleButton.click();
          }
        }}
        disabled={isLoading}
        className="group relative w-full py-2.5 px-5 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-pink-300 text-gray-700 font-bold text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
      >
        {/* Google Icon */}
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );
} 