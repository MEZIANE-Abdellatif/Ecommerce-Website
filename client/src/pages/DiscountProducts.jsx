import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton";
import axios from "axios";

export default function DiscountProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount');
  const [discountRange, setDiscountRange] = useState('all');

  useEffect(() => {
    const fetchDiscountProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        // Create discount products with smart discount logic
        const discountProducts = response.data.map(product => {
          const originalPrice = product.price * (1.2 + Math.random() * 0.8); // 20-100% markup
          const discountPercentage = Math.floor(15 + Math.random() * 60); // 15-75% discount
          const discountedPrice = originalPrice * (1 - discountPercentage / 100);
          
          return {
            ...product,
            originalPrice: Math.round(originalPrice * 100) / 100,
            price: Math.round(discountedPrice * 100) / 100,
            discountPercentage,
            savings: Math.round((originalPrice - discountedPrice) * 100) / 100,
            limitedTime: Math.random() > 0.7, // 30% chance of limited time
            flashSale: Math.random() > 0.9, // 10% chance of flash sale
            almostGone: Math.random() > 0.85 // 15% chance of almost gone
          };
        }).filter(product => product.discountPercentage >= 15); // Only show products with 15%+ discount
        
        setProducts(discountProducts);
      } catch (err) {
        console.error("Error fetching discount products:", err);
        setError("Failed to load discount products. Please try again later.");
        // Fallback to mock data
        setProducts([
          {
            _id: 1,
            name: "Premium Wireless Headphones",
            price: 89.99,
            originalPrice: 199.99,
            discountPercentage: 55,
            savings: 110.00,
            images: ["https://source.unsplash.com/300x200/?headphones,premium"],
            description: "Top-rated wireless headphones with noise cancellation.",
            category: "Electronics",
            rating: 4.9,
            reviews: 1247,
            limitedTime: true,
            flashSale: false,
            almostGone: false
          },
          {
            _id: 2,
            name: "Smart Fitness Watch",
            price: 149.99,
            originalPrice: 299.99,
            discountPercentage: 50,
            savings: 150.00,
            images: ["https://source.unsplash.com/300x200/?smartwatch,fitness"],
            description: "Advanced fitness tracking with health monitoring.",
            category: "Electronics",
            rating: 4.8,
            reviews: 892,
            limitedTime: false,
            flashSale: true,
            almostGone: false
          },
          {
            _id: 3,
            name: "Professional Running Shoes",
            price: 79.99,
            originalPrice: 159.99,
            discountPercentage: 50,
            savings: 80.00,
            images: ["https://source.unsplash.com/300x200/?runningshoes,professional"],
            description: "High-performance running shoes for athletes.",
            category: "Sports",
            rating: 4.7,
            reviews: 1567,
            limitedTime: true,
            flashSale: false,
            almostGone: true
          },
          {
            _id: 4,
            name: "Luxury Backpack",
            price: 59.99,
            originalPrice: 119.99,
            discountPercentage: 50,
            savings: 60.00,
            images: ["https://source.unsplash.com/300x200/?luxurybackpack,premium"],
            description: "Premium leather backpack for professionals.",
            category: "Accessories",
            rating: 4.6,
            reviews: 743,
            limitedTime: false,
            flashSale: false,
            almostGone: false
          },
          {
            _id: 5,
            name: "Designer Sunglasses",
            price: 99.99,
            originalPrice: 249.99,
            discountPercentage: 60,
            savings: 150.00,
            images: ["https://source.unsplash.com/300x200/?designersunglasses,luxury"],
            description: "Luxury sunglasses with UV protection.",
            category: "Accessories",
            rating: 4.8,
            reviews: 567,
            limitedTime: true,
            flashSale: false,
            almostGone: false
          },
          {
            _id: 6,
            name: "Gaming Laptop Pro",
            price: 999.99,
            originalPrice: 1599.99,
            discountPercentage: 38,
            savings: 600.00,
            images: ["https://source.unsplash.com/300x200/?gaminglaptop,pro"],
            description: "High-performance gaming laptop with RTX graphics.",
            category: "Electronics",
            rating: 4.9,
            reviews: 234,
            limitedTime: false,
            flashSale: true,
            almostGone: false
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountProducts();
  }, []);

  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesDiscountRange = discountRange === 'all' || 
        (discountRange === 'high' && product.discountPercentage >= 50) ||
        (discountRange === 'medium' && product.discountPercentage >= 25 && product.discountPercentage < 50) ||
        (discountRange === 'low' && product.discountPercentage < 25);
      return matchesCategory && matchesDiscountRange;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          return b.discountPercentage - a.discountPercentage;
        case 'savings':
          return b.savings - a.savings;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return b.discountPercentage - a.discountPercentage;
      }
    });


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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 pt-20">
      {/* Hero Section with Discount Theme */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-pink-400/20 to-red-400/20"></div>
        
        {/* Floating Money/Price Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-red-400 to-pink-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-600 mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
              <Link to="/" className="hover:text-pink-600 transition-colors font-medium">Home</Link>
              <span className="text-pink-400">✦</span>
              <span className="text-gray-900 font-semibold">Discount Products</span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-green-500 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6 animate-fade-in-up">
                Discounts
              </h1>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-red-400 rounded-full animate-ping"></div>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              💰 Amazing deals and discounts on premium products - Save big today! 💰
            </p>
            <div className="mt-8 flex justify-center space-x-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sort Options */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Sort by</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'discount', label: 'Highest Discount' },
                  { value: 'savings', label: 'Most Savings' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'newest', label: 'Newest Deals' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                        : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-green-600 border border-gray-200'
                    }`}
                  >
{option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-6 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-2xl transition-all duration-300 text-lg appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Discount Range Filter */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Discount Range</h3>
              <select
                value={discountRange}
                onChange={(e) => setDiscountRange(e.target.value)}
                className="w-full py-3 px-6 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-2xl transition-all duration-300 text-lg appearance-none cursor-pointer"
              >
                <option value="all">All Discounts</option>
                <option value="high">50%+ Off</option>
                <option value="medium">25-49% Off</option>
                <option value="low">15-24% Off</option>
              </select>
            </div>
          </div>

          {/* Results Count & Total Savings */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-lg">
              Showing <span className="font-bold text-green-600">{filteredProducts.length}</span> discounted products
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Total potential savings: <span className="font-bold text-green-600 text-xl">
                ${filteredProducts.reduce((total, product) => total + product.savings, 0).toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 max-w-md mx-auto">
              <div className="text-6xl mb-6">💰</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No discounts found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filter criteria</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div 
                key={product._id || product.id} 
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* 3D Card Shadow with Mazzinka Identity Colors */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-3xl blur-2xl group-hover:blur-2xl transition-all duration-500 transform group-hover:scale-105"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 hover:shadow-green-500/25 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-102 h-full flex flex-col">
                  {/* Image Container with Mazzinka Effect */}
                  <div className="relative overflow-hidden rounded-2xl mb-6 group-hover:rounded-3xl transition-all duration-500 flex-shrink-0">
                    {/* Mazzinka Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-400/20 to-pink-400/20 z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                    
                    <img
                      src={product.images?.[0] || product.image || "https://via.placeholder.com/300x200"}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Floating Action Buttons */}
                    <div className="absolute top-4 right-4 z-20 space-y-3">
                      <FavoriteButton 
                        product={product}
                        className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg hover:rotate-12"
                      />
                    </div>
                    
                    {/* Mazzinka Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Product Information - Flexbox layout for perfect price alignment */}
                  <div className="flex flex-col h-full">
                    {/* Title - centralized with flex-1 */}
                    <div className="flex-1 flex items-center justify-center text-center px-2 mb-6">
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-600 transition-colors duration-300 leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    {/* Price & Discount Information */}
                    <div className="text-center mb-4">
                      {/* Current Price */}
                      <div className="mb-2">
                        <span className="text-3xl font-black bg-gradient-to-r from-green-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                          ${product.price}
                        </span>
                      </div>
                      
                      {/* Previous Price & Discount Percentage */}
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-lg text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-105 transition-all duration-300">
                          -{product.discountPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Review Stars & Grade */}
                    <div className="text-center mb-6">
                      {/* Star Rating */}
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.floor(product.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'
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
                        <span className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                          {product.rating || 4.5}
                        </span>
                        <span className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                          ({product.reviews || 0} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Button - always sticks to bottom */}
                    <div className="mt-auto">
                      <Link
                        to={`/products/${product._id || product.id}`}
                        className="group/btn relative inline-block w-full"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg group-hover/btn:blur-xl transition-all duration-500"></div>
                        <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-2xl font-bold text-lg shadow-xl transform group-hover/btn:scale-105 transition-all duration-500">
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
        )}

        {/* Interactive Pagination */}
        <div className="flex justify-center mt-16">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30">
            <div className="flex items-center space-x-4">
              <button className="p-4 text-gray-500 hover:text-green-600 transition-colors transform hover:scale-110 hover:-translate-x-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  className={`w-14 h-14 rounded-2xl text-lg font-bold transition-all duration-500 transform hover:scale-110 ${
                    page === 1
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                      : 'text-gray-700 hover:bg-white/80 hover:text-green-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button className="p-4 text-gray-500 hover:text-green-600 transition-colors transform hover:scale-110 hover:translate-x-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
