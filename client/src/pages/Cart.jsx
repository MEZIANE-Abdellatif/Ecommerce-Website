import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import { Link } from "react-router-dom";

export default function Cart() {
  const { 
    cart, 
    removeFromCart, 
    increaseQuantity, 
    decreaseQuantity, 
    getCartTotal,
    clearCart 
  } = useCart();

  const [isClearing, setIsClearing] = useState(false);
  const total = getCartTotal();

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-rose-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            {/* Empty Cart Animation */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-16 h-16 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce delay-100"></div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md text-center">
              Discover our amazing collection of beauty products and start building your perfect routine
            </p>
            
            <Link 
              to="/products" 
              className="group relative inline-block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl transform group-hover:scale-105 transition-all duration-500">
                🛍️ Start Shopping
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Title, Subtitle, and Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Subtitle */}
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent py-4">
                  Your Shopping Cart
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Review your selections and proceed to checkout with confidence
                </p>
              </div>

              {/* Cart Items Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-lg">{cart.length}</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Cart Items</h2>
                </div>
                
                <button
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className={`group relative inline-flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                    isClearing 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>{isClearing ? 'Clearing...' : 'Clear Cart'}</span>
                </button>
              </div>

              {/* Cart Items List */}
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500"
                  >
                    {/* 3D Card Shadow with Mazzinka Identity Colors */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-3xl blur-2xl group-hover:blur-2xl transition-all duration-500"></div>
                    
                    <div className="relative flex flex-col md:flex-row items-center md:items-center gap-6">
                      {/* Product Image */}
                      <div className="relative overflow-hidden rounded-2xl flex-shrink-0">
                        <img
                          src={item.images?.[0] || item.image || "https://via.placeholder.com/300x200"}
                          alt={item.name}
                          className="w-24 h-24 md:w-32 md:h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Mazzinka Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-rose-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        
                        {/* Price Display */}
                        <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                          <span className="text-2xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                            ${((typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, "")) : parseFloat(item.price)) * (item.quantity || 1)).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ${(typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, "")) : parseFloat(item.price)).toFixed(2)} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Actions */}
                      <div className="flex flex-col items-center md:items-end space-y-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-1 border border-pink-200">
                          <button
                            onClick={() => decreaseQuantity(item._id || item.id)}
                            disabled={item.quantity <= 1}
                            className={`w-10 h-10 rounded-xl font-bold text-lg transition-all duration-300 ${
                              item.quantity <= 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-pink-600 hover:bg-pink-100 hover:scale-110'
                            }`}
                          >
                            -
                          </button>
                          <span className="w-12 h-10 flex items-center justify-center text-gray-900 font-bold text-lg bg-white rounded-xl shadow-sm">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item._id || item.id)}
                            className="w-10 h-10 rounded-xl font-bold text-lg text-pink-600 hover:bg-pink-100 hover:scale-110 transition-all duration-300"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item._id || item.id)}
                          className="group/remove relative inline-flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 hover:scale-105 transition-all duration-300"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h3>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{cart.length}</span>
                      </div>
                      <span className="text-gray-600 font-medium">
                        {cart.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Summary Details */}
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="text-lg font-semibold text-gray-900">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Shipping</span>
                      <span className="text-green-600 font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-3xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
    
                  <div className="flex flex-col gap-3 sm:gap-4">
                      <Link
                        to="/checkout"
                        className="relative group w-full"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                        <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-2xl font-bold text-base sm:text-lg shadow-xl transform group-hover:scale-105 transition-all duration-500 text-center">
                          🚀 Proceed to Checkout
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      </Link>

                      <Link
                        to="/products"
                        className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-3 px-4 sm:py-4 sm:px-6 rounded-2xl font-semibold text-center hover:from-gray-200 hover:to-gray-300 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                      >
                        🛍️ Continue Shopping
                      </Link>
                  </div>


                  {/* Trust Indicators */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Secure Checkout</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Free Shipping</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 