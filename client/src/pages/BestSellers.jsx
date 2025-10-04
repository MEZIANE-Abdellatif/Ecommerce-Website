import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import FavoriteButton from "../components/FavoriteButton";
import axios from "axios";

export default function BestSellers() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('sales');
  const [timeframe, setTimeframe] = useState('all-time');

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        // Simulate best sellers by adding sales data and filtering
        const bestSellerProducts = response.data.map(product => ({
          ...product,
          sales: Math.floor(Math.random() * 1000) + 100, // Simulate sales data
          trending: Math.random() > 0.5, // Random trending status
          rank: Math.floor(Math.random() * 50) + 1 // Random rank
        })).sort((a, b) => b.sales - a.sales);
        
        setProducts(bestSellerProducts);
      } catch (err) {
        console.error("Error fetching best sellers:", err);
        setError("Failed to load best sellers. Please try again later.");
        // Fallback to mock data
        setProducts([
          {
            _id: 1,
            name: "Premium Wireless Headphones",
            price: 159.99,
            originalPrice: 199.99,
            images: ["https://source.unsplash.com/300x200/?headphones,premium"],
            description: "Top-rated wireless headphones with noise cancellation.",
            category: "Electronics",
            rating: 4.9,
            reviews: 1247,
            sales: 2341,
            trending: true,
            rank: 1
          },
          {
            _id: 2,
            name: "Smart Fitness Watch",
            price: 299.99,
            originalPrice: 349.99,
            images: ["https://source.unsplash.com/300x200/?smartwatch,fitness"],
            description: "Advanced fitness tracking with health monitoring.",
            category: "Electronics",
            rating: 4.8,
            reviews: 892,
            sales: 1876,
            trending: true,
            rank: 2
          },
          {
            _id: 3,
            name: "Professional Running Shoes",
            price: 129.99,
            originalPrice: 159.99,
            images: ["https://source.unsplash.com/300x200/?runningshoes,professional"],
            description: "High-performance running shoes for athletes.",
            category: "Sports",
            rating: 4.7,
            reviews: 1567,
            sales: 3421,
            trending: false,
            rank: 3
          },
          {
            _id: 4,
            name: "Luxury Backpack",
            price: 89.99,
            originalPrice: 119.99,
            images: ["https://source.unsplash.com/300x200/?luxurybackpack,premium"],
            description: "Premium leather backpack for professionals.",
            category: "Accessories",
            rating: 4.6,
            reviews: 743,
            sales: 1234,
            trending: true,
            rank: 4
          },
          {
            _id: 5,
            name: "Designer Sunglasses",
            price: 199.99,
            originalPrice: 249.99,
            images: ["https://source.unsplash.com/300x200/?designersunglasses,luxury"],
            description: "Luxury sunglasses with UV protection.",
            category: "Accessories",
            rating: 4.8,
            reviews: 567,
            sales: 987,
            trending: false,
            rank: 5
          },
          {
            _id: 6,
            name: "Gaming Laptop Pro",
            price: 1299.99,
            originalPrice: 1599.99,
            images: ["https://source.unsplash.com/300x200/?gaminglaptop,pro"],
            description: "High-performance gaming laptop with RTX graphics.",
            category: "Electronics",
            rating: 4.9,
            reviews: 234,
            sales: 456,
            trending: true,
            rank: 6
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'sales':
          return b.sales - a.sales;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'trending':
          return b.trending - a.trending;
        default:
          return a.rank - b.rank;
      }
    });

  const getRankBadge = (rank) => {
    if (rank <= 3) {
      const colors = {
        1: 'from-yellow-400 to-yellow-600',
        2: 'from-gray-300 to-gray-500', 
        3: 'from-orange-400 to-orange-600'
      };
      const emoji = { 1: '🥇', 2: '🥈', 3: '🥉' };
      return (
        <div className={`absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-r ${colors[rank]} rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg z-30`}>
          {emoji[rank]}
        </div>
      );
    }
    return (
      <div className="absolute -top-2 -left-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-30">
        #{rank}
      </div>
    );
  };

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
      {/* Hero Section with Best Sellers Theme */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20"></div>
        
        {/* Floating Trophy Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-600 mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
              <Link to="/" className="hover:text-pink-600 transition-colors font-medium">Home</Link>
              <span className="text-pink-400">✦</span>
              <span className="text-gray-900 font-semibold">Best Sellers</span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-yellow-500 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-fade-in-up">
                Best Sellers
              </h1>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              🏆 Discover our top-performing products loved by thousands of customers 🏆
            </p>
            <div className="mt-8 flex justify-center space-x-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sort Options */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Sort by</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'sales', label: 'Sales Volume' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'trending', label: 'Trending Now' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50'
                        : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-pink-600 border border-gray-200'
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
                className="w-full py-3 px-6 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 rounded-2xl transition-all duration-300 text-lg appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-lg">
              Showing <span className="font-bold text-yellow-600">{filteredProducts.length}</span> best-selling products
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 max-w-md mx-auto">
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No best sellers found</h3>
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
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-3xl blur-2xl group-hover:blur-2xl transition-all duration-500 transform group-hover:scale-105"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 hover:shadow-yellow-500/25 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-102 h-full flex flex-col">
                  {/* Image Container with Mazzinka Effect */}
                  <div className="relative overflow-hidden rounded-2xl mb-6 group-hover:rounded-3xl transition-all duration-500 flex-shrink-0">
                    {/* Mazzinka Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-pink-400/20 z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                    
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
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Product Information - Flexbox layout for perfect price alignment */}
                  <div className="flex flex-col h-full">
                    {/* Title - centralized with flex-1 */}
                    <div className="flex-1 flex items-center justify-center text-center px-2 mb-6">
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-yellow-600 transition-colors duration-300 leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    {/* Price - always just above button */}
                    <div className="text-center mb-4">
                      <span className="text-3xl font-black bg-gradient-to-r from-yellow-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="mt-2">
                          <span className="text-lg text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        </div>
                      )}
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
                        <span className="text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300">
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
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur-lg group-hover/btn:blur-xl transition-all duration-500"></div>
                        <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-2xl font-bold text-lg shadow-xl transform group-hover/btn:scale-105 transition-all duration-500">
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
              <button className="p-4 text-gray-500 hover:text-yellow-600 transition-colors transform hover:scale-110 hover:-translate-x-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  className={`w-14 h-14 rounded-2xl text-lg font-bold transition-all duration-500 transform hover:scale-110 ${
                    page === 1
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50'
                      : 'text-gray-700 hover:bg-white/80 hover:text-yellow-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button className="p-4 text-gray-500 hover:text-yellow-600 transition-colors transform hover:scale-110 hover:translate-x-2">
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
