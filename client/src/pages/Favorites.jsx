import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
    setLoading(false);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  const removeFromFavorites = (productId) => {
    const updatedFavorites = favorites.filter(item => item._id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    // Dispatch custom event to update navbar count
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-rose-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-60 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl shadow-2xl mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-4">
                My Favorites
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Your curated collection of beloved products, saved for those special moments
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="text-3xl font-bold text-pink-600 mb-2">{favorites.length}</div>
                <div className="text-gray-600">Total Items</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  ${favorites.reduce((total, item) => total + (parseFloat(item.price) || 0), 0).toFixed(2)}
                </div>
                <div className="text-gray-600">Total Value</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="text-3xl font-bold text-rose-600 mb-2">
                  {favorites.filter(item => item.category).length}
                </div>
                <div className="text-gray-600">Categories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {favorites.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-16 h-16 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No favorites yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start building your collection by adding products you love to your favorites
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Discover Products
                </Link>
              </div>
            ) : (
              /* Favorites Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {favorites.map((product) => (
                  <div
                    key={product._id}
                    className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden h-full flex flex-col"
                  >
                    {/* Remove from Favorites Button - Modern Design */}
                    <button
                      onClick={() => removeFromFavorites(product._id)}
                      className="absolute top-4 right-4 z-10 group/remove"
                      title="Remove from favorites"
                    >
                      {/* Outer ring with gradient */}
                      <div className="relative w-10 h-10">
                        {/* Background circle with gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-red-50 to-rose-100 rounded-full shadow-lg group-hover/remove:shadow-xl transition-all duration-300"></div>
                        
                        {/* Animated border */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-red-400 to-rose-400 rounded-full p-[2px] opacity-0 group-hover/remove:opacity-100 transition-all duration-300">
                          <div className="w-full h-full bg-white rounded-full"></div>
                        </div>
                        
                        {/* Icon container */}
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* Bin icon that transforms to broken heart on hover */}
                          <div className="relative w-5 h-5">
                            {/* Default bin/trash icon */}
                            <svg className="w-5 h-5 text-gray-500 group-hover/remove:text-red-500 transition-all duration-300 transform group-hover/remove:scale-110 group-hover/remove:rotate-12 absolute inset-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path
                                className="transition-all duration-300"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            
                            {/* Broken heart that appears on hover */}
                            <svg className="w-5 h-5 text-red-500 opacity-0 group-hover/remove:opacity-100 transition-all duration-300 transform group-hover/remove:scale-110 group-hover/remove:rotate-12 absolute inset-0" fill="currentColor" viewBox="0 0 20 20">
                              {/* Broken heart shape */}
                              <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              />
                              {/* Crack lines */}
                              <path
                                className="stroke-white stroke-[2] fill-none"
                                d="M7 7l6 6m0-6l-6 6"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Subtle pulse effect */}
                        <div className="absolute inset-0 bg-pink-300 rounded-full opacity-0 group-hover/remove:opacity-20 group-hover/remove:animate-ping transition-all duration-300"></div>
                      </div>
                    </button>

                    {/* Product Image */}
                    <div className="relative mb-6">
                      <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center overflow-hidden">
                        <img
                          src={product.image || product.images?.[0] || "https://via.placeholder.com/300x200"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Category Badge */}
                      {product.category && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg">
                            {product.category}
                          </span>
                        </div>
                      )}

                      {/* New Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                          ✨ New
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col flex-1 space-y-4">
                      {/* Title */}
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-pink-600 transition-colors duration-300 leading-tight min-h-[3.5rem] flex items-center justify-center text-center">
                        <span className="line-clamp-2 overflow-hidden">
                          {product.name}
                        </span>
                      </h3>

                      {/* Price */}
                      <div className="text-center flex-shrink-0">
                        <span className="text-3xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                      </div>

                      {/* Review Stars */}
                      <div className="flex items-center justify-center space-x-1 flex-shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">(4.8)</span>
                      </div>

                    {/* Action Buttons - Pushed to bottom */}
                    <div className="space-y-3 mt-auto flex-shrink-0 relative z-20">
                        <Link
                          to={`/products/${product._id}`}
                          className="group/btn relative inline-block w-full z-20"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur-lg group-hover/btn:blur-xl transition-all duration-500"></div>
                          <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-6 rounded-2xl font-bold text-lg shadow-xl transform group-hover/btn:scale-105 transition-all duration-500 text-center z-20">
                            🛍️ Discover
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </Link>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative z-20"
                        >
                          🛒 Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(-10px) rotate(240deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
