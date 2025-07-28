import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GoogleLoginButton({ onSuccess, onError }) {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      // Send the Google token to your backend
      const response = await axios.post('http://localhost:5000/api/users/google-login', {
        credential: credentialResponse.credential,
      });

      // Store the token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        isAdmin: response.data.isAdmin,
      }));

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Redirect to profile page
      navigate('/profile');
    } catch (error) {
      console.error('Google login error:', error);
      if (onError) {
        onError(error.response?.data?.message || 'Google login failed');
      }
    }
  };

  const handleError = (error) => {
    // Suppress harmless FedCM AbortError warnings
    if (error?.message?.includes('AbortError') || error?.message?.includes('FedCM')) {
      console.log('FedCM warning suppressed - this is normal behavior');
      return;
    }
    
    console.error('Google login failed:', error);
    if (onError) {
      onError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
} 