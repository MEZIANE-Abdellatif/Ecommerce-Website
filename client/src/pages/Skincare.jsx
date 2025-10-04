import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';

const Skincare = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkinType, setSelectedSkinType] = useState('all');
  const [selectedConcern, setSelectedConcern] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const fetchSkincareProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('category', 'skincare');
      if (selectedSkinType && selectedSkinType !== 'all') {
        params.append('skinType', selectedSkinType);
      }
      if (selectedConcern && selectedConcern !== 'all') {
        params.append('concern', selectedConcern);
      }
      
      console.log('Fetching with params:', params.toString()); // Debug log
      const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
      const data = await response.json();
      console.log('Received products:', data.length); // Debug log
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching skincare products:', error);
      setLoading(false);
    }
  }, [selectedSkinType, selectedConcern]);

  useEffect(() => {
    fetchSkincareProducts();
  }, [fetchSkincareProducts]);


  const skinTypes = [
    { id: 'all', label: 'All Skin Types', icon: '✨' },
    { id: 'normal', label: 'Normal', icon: '✨' },
    { id: 'oily', label: 'Oily', icon: '💧' },
    { id: 'dry', label: 'Dry', icon: '🌵' },
    { id: 'combination', label: 'Combination', icon: '🔄' },
    { id: 'sensitive', label: 'Sensitive', icon: '🌸' }
  ];

  const concerns = [
    { id: 'all', label: 'All Concerns', icon: '✨' },
    { id: 'acne', label: 'Acne', icon: '🎯' },
    { id: 'aging', label: 'Aging', icon: '⏰' },
    { id: 'dryness', label: 'Dryness', icon: '💧' },
    { id: 'sensitivity', label: 'Sensitivity', icon: '🌸' },
    { id: 'dark_spots', label: 'Dark Spots', icon: '🌙' },
    { id: 'fine_lines', label: 'Fine Lines', icon: '📏' },
    { id: 'hydration', label: 'Hydration', icon: '💦' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg w-1/4 mb-4"></div>
            <div className="h-4 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="h-48 bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gradient-to-r from-pink-200 to-purple-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-pink-200 to-purple-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 pt-0 relative overflow-hidden">
      {/* Animated Background Particles with Mazzinka Colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-purple-300/20 to-rose-300/20 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-br from-rose-300/20 to-pink-300/20 rounded-full animate-ping opacity-60" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Hero Section with 3D Effect and Mazzinka Identity */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Glassmorphism Breadcrumbs with Mazzinka Colors */}
          <nav className="text-sm text-gray-600 mb-8">
            <div className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-xl rounded-full px-8 py-4 shadow-2xl border border-white/30">
              <Link to="/" className="hover:text-pink-600 transition-colors font-medium"> Home</Link>
              <span className="text-pink-400 text-xl">✦</span>
              <span className="text-gray-900 font-bold">Skincare</span>
            </div>
          </nav>

          {/* Simple Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Skincare
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our collection of premium skincare products
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        {/* Comprehensive Skincare Filter System */}
        <div className="mb-16">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Complete Skincare Journey</h3>
            

            {/* Skin Type & Advanced Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Skin Type Selection */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-700 block">Skin Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {skinTypes.map((skinType) => (
                    <button
                      key={skinType.id}
                      onClick={() => setSelectedSkinType(skinType.id)}
                      className={`p-3 rounded-lg text-center transition-all duration-300 transform hover:scale-105 ${
                        selectedSkinType === skinType.id
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                          : 'bg-white/80 text-gray-700 border-2 border-transparent hover:border-pink-300 hover:bg-white shadow-md'
                      }`}
                    >
                      <div className="text-xl mb-1">{skinType.icon}</div>
                      <div className="text-xs font-medium">{skinType.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sort Options */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-700 block">Sort Products</label>
                <div className="space-y-3">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 bg-white/80 border-2 border-transparent hover:border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-md text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="best-selling">Best Selling</option>
                    <option value="highest-rated">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Skin Concerns */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-700 block">Skin Concerns</label>
                <select
                  value={selectedConcern}
                  onChange={(e) => setSelectedConcern(e.target.value)}
                  className="w-full p-3 bg-white/80 border-2 border-transparent hover:border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-md text-sm"
                >
                  {concerns.map((concern) => (
                    <option key={concern.id} value={concern.id}>
                      {concern.icon} {concern.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Product Grid with Mazzinka Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {products
            .sort((a, b) => {
              switch (sortBy) {
                case 'price-low':
                  return a.price - b.price;
                case 'price-high':
                  return b.price - a.price;
                case 'newest':
                  return new Date(b.createdAt) - new Date(a.createdAt);
                case 'best-selling':
                  return (b.sold || 0) - (a.sold || 0);
                case 'highest-rated':
                  return (b.rating || 0) - (a.rating || 0);
                case 'featured':
                default:
                  return 0;
              }
            })
            .map((product, index) => (
            <div 
              key={product._id} 
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* 3D Card Shadow with Mazzinka Colors */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-3xl blur-2xl group-hover:blur-2xl transition-all duration-500 transform group-hover:scale-105"></div>
              
              {/* Main Card */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 hover:shadow-pink-500/25 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-102 h-full flex flex-col">
                {/* Image Container with Mazzinka Effect */}
                <div className="relative overflow-hidden rounded-2xl mb-6 group-hover:rounded-3xl transition-all duration-500 flex-shrink-0">
                  {/* Mazzinka Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-rose-400/20 z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                  
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 z-20 space-y-3">
                    <FavoriteButton 
                      product={product}
                      className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg hover:rotate-12"
                    />
                    
                    <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-purple-600 hover:bg-white transition-all duration-300 transform hover:scale-110 hover:-rotate-12 shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Mazzinka Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Product Information - Flexbox layout for perfect price alignment */}
                <div className="flex flex-col h-full">
                  {/* Title - centralized with flex-1 */}
                  <div className="flex-1 flex items-center justify-center text-center px-2 mb-6">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-pink-600 transition-colors duration-300 leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price - always just above button */}
                  <div className="text-center mb-4">
                    <span className="text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                  </div>

                  {/* Review Stars & Grade */}
                  <div className="text-center mb-6">
                    {/* Star Rating */}
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
                            star <= 4 ? 'text-yellow-400' : 'text-gray-300'
                          } transition-all duration-300 group-hover:scale-110`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    
                    {/* Grade & Review Count */}
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-lg font-bold text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                        4.8
                      </span>
                      <span className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                        (127 reviews)
                      </span>
                    </div>
                  </div>
                  
                  {/* Button - always sticks to bottom */}
                  <div className="mt-auto">
                    <Link
                      to={`/products/${product._id}`}
                      className="group/btn relative inline-block w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur-lg group-hover/btn:blur-xl transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl transform group-hover/btn:scale-105 transition-all duration-500 whitespace-nowrap text-center">
                        Discover
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Pagination with Mazzinka Identity */}
        <div className="flex justify-center">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30">
            <div className="flex items-center space-x-4">
              <button className="p-4 text-gray-500 hover:text-pink-600 transition-colors transform hover:scale-110 hover:-translate-x-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  className={`w-14 h-14 rounded-2xl text-lg font-bold transition-all duration-500 transform hover:scale-110 ${
                    page === 1
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/50'
                      : 'text-gray-700 hover:bg-white/80 hover:text-pink-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button className="p-4 text-gray-500 hover:text-pink-600 transition-colors transform hover:scale-110 hover:translate-x-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-pink-900 via-purple-900 to-rose-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-16 w-32 h-32 bg-gradient-to-br from-pink-700/20 to-purple-700/20 rounded-full transform rotate-12 animate-pulse opacity-60"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-700/20 to-rose-700/20 rounded-full transform -rotate-12 animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-br from-rose-700/20 to-pink-700/20 rounded-full transform rotate-45 animate-pulse opacity-60" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-600 rounded-full animate-ping opacity-40"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-600 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center mb-16">
            <div className="relative inline-block group">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent mb-6 animate-fade-in-up">Mazzinka</h2>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-full h-4 bg-gradient-to-r from-white/20 via-pink-100/20 to-purple-100/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700"></div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up mb-8" style={{ animationDelay: '0.3s' }}>✨ Where beauty meets innovation ✨</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-lg">M</span></div>
                <h3 className="text-xl font-bold text-white">About Mazzinka</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm">Discover premium beauty products that enhance your natural radiance and confidence. We're committed to bringing you the finest beauty essentials.</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></div>
                <h3 className="text-xl font-bold text-white">Quick Links</h3>
              </div>
              <ul className="space-y-3">
                <li><Link to="/makeup" className="text-gray-300 hover:text-pink-300 transition-colors duration-300 flex items-center space-x-2 group"><span className="w-1.5 h-1.5 bg-pink-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span><span>Makeup</span></Link></li>
                <li><Link to="/skincare" className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center space-x-2 group"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span><span>Skincare</span></Link></li>
                <li><Link to="/haircare" className="text-gray-300 hover:text-rose-300 transition-colors duration-300 flex items-center space-x-2 group"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span><span>Haircare</span></Link></li>
                <li><Link to="/fragrance" className="text-gray-300 hover:text-pink-300 transition-colors duration-300 flex items-center space-x-2 group"><span className="w-1.5 h-1.5 bg-pink-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span><span>Fragrance</span></Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-purple-400 rounded-lg flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
                <h3 className="text-xl font-bold text-white">Customer Service</h3>
              </div>
              <ul className="space-y-3">
                <li><Link to="/contact" className="text-gray-300 hover:text-pink-300 transition-colors duration-300 flex items-center space-x-2 group"><span className="w-1.5 h-1.5 bg-pink-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span><span>Contact Us</span></Link></li>
                <li><Link to="/shipping" className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center space-x-2 group"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span><span>Shipping Info</span></Link></li>
                <li><Link to="/returns" className="text-gray-300 hover:text-rose-300 transition-colors duration-300 flex items-center space-x-2 group"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span><span>Returns</span></Link></li>
                <li><Link to="/faq" className="text-gray-300 hover:text-pink-300 transition-colors duration-300 flex items-center space-x-2 group"><span className="w-1.5 h-1.5 bg-pink-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span><span>FAQ</span></Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                <h3 className="text-xl font-bold text-white">Stay Connected</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">Subscribe to our newsletter for exclusive offers, beauty tips, and early access to new products.</p>
              <div className="space-y-3">
                <input type="email" placeholder="Enter your email address" className="w-full px-4 py-3 bg-pink-800/30 border border-pink-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm" />
                <button className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-rose-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25">Subscribe Now</button>
              </div>
              <div className="text-xs text-gray-400 text-center">🔒 We respect your privacy. Unsubscribe at any time.</div>
            </div>
          </div>
          <div className="border-t border-pink-700/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <p className="text-gray-400 text-sm">© 2024 Mazzinka. All rights reserved.</p>
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-gray-500">•</span>
                  <Link to="/privacy" className="text-gray-400 hover:text-pink-300 transition-colors text-sm">Privacy Policy</Link>
                  <span className="text-gray-500">•</span>
                  <Link to="/terms" className="text-gray-400 hover:text-pink-300 transition-colors text-sm">Terms of Service</Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Beauty that empowers</span>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Fixed Decorative Elements with Mazzinka Colors */}
      <div className="fixed top-1/3 left-8 w-3 h-3 bg-pink-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="fixed top-1/2 right-16 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed bottom-1/3 left-1/4 w-4 h-4 bg-rose-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-1/4 right-1/3 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

export default Skincare;
