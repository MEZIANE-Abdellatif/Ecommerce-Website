import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CartProvider } from './context/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Suppress harmless Google login errors in console
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  
  // Suppress harmless Google/FedCM errors
  if (message.includes('FedCM') || 
      message.includes('AbortError') || 
      message.includes('signal is aborted') ||
      message.includes('The request has been aborted')) {
    return; // Don't log these errors
  }
  
  // Log all other errors normally
  originalConsoleError.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="270228367132-5urh4v5tq8omioruufsaktcg7r5l58nf.apps.googleusercontent.com">
      <CartProvider>
    <App />
      </CartProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
