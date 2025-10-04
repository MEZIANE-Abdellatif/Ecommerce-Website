import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export default function Navbar() {
  const { getCartItemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const itemCount = getCartItemCount();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [prevItemCount, setPrevItemCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // Close mobile menu when clicking outside or on route change
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu-container') && !event.target.closest('.mobile-menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isMenuOpen]);

  // Load initial favorites count and listen for changes
  useEffect(() => {
    const updateFavoritesCount = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoritesCount(favorites.length);
    };

    // Load initial count
    updateFavoritesCount();

    // Listen for favorites changes
    window.addEventListener('favoritesChanged', updateFavoritesCount);

    // Cleanup
    return () => {
      window.removeEventListener('favoritesChanged', updateFavoritesCount);
    };
  }, []);

  // Animate cart when items are added
  useEffect(() => {
    if (itemCount > prevItemCount) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 500);
    }
    setPrevItemCount(itemCount);
  }, [itemCount, prevItemCount]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("user");
    localStorage.removeItem("paymentMethod");
    setUser(null);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false); // Close mobile menu after search
    }
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-pink-600 transform hover:scale-105 relative group ${
        location.pathname === to ? "text-pink-600" : "text-gray-600"
      }`}
    >
      {label}
      <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full ${
        location.pathname === to ? "w-full" : ""
      }`}></span>
    </Link>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16 min-w-0">
          {/* Logo */}
          <div className="flex-shrink-0 min-w-0 max-w-[120px] sm:max-w-none">
            <Link to="/" className="text-sm sm:text-xl md:mr-10 font-bold text-gray-900 hover:text-pink-600 transition-all duration-300 transform hover:scale-105 block truncate">
              <span className="bg-gradient-to-r from-gray-900 via-pink-600 to-gray-900 bg-clip-text text-transparent">
                MaZzinka.pl
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLink("/makeup", "Makeup")}
            {navLink("/skincare", "Skincare")}
            {navLink("/haircare", "Haircare")}
            {navLink("/fragrance", "Fragrance")}
            {navLink("/new-arrivals", "New Arrivals")}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className={`h-5 w-5 transition-colors ${isSearchFocused ? 'text-gray-400' : 'text-gray-400'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:bg-white transition-all duration-300 text-sm hover:bg-white"
              />
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-0 sm:space-x-4 min-w-0">
            {/* Wishlist */}
            <Link to="/favorites" className="p-1 sm:p-2 text-gray-600 hover:text-pink-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 relative touch-manipulation min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center flex-shrink-0">
              <div className="relative">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg transition-all duration-300 transform">
                    {favoritesCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Cart with Animation */}
            <Link to="/cart" className={`p-1 sm:p-2 text-gray-600 hover:text-pink-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 relative touch-manipulation min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center flex-shrink-0 ${cartBounce ? 'animate-bounce' : ''}`}>
              <div className="relative">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg ${cartBounce ? 'animate-pulse' : ''} transition-all duration-300 transform`}>
                    {itemCount}
                  </span>
                )}
                {cartBounce && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-400 rounded-full animate-ping opacity-75"></div>
                )}
              </div>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 text-gray-600 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 touch-manipulation min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] justify-center flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-pink-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 max-w-[calc(100vw-2rem)]">
                  <div className="py-2 sm:py-3">
                    {/* User Info */}
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-pink-100">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                    </div>
                    
                    {/* Profile Link */}
                    <Link 
                      to="/profile" 
                      className="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200 group"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-gray-400 group-hover:text-pink-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium truncate">My Profile</span>
                    </Link>
                    
                    {/* Dashboard Link (Admin Only) */}
                    {(user.isAdmin || user.isSuperAdmin) && (
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200 group"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-gray-400 group-hover:text-pink-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-medium truncate">Dashboard</span>
                      </Link>
                    )}
                    
                    {/* Divider */}
                    <div className="border-t border-pink-100 my-2"></div>
                    
                    {/* Sign Out Button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 group"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-red-400 group-hover:text-red-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium truncate">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors p-1 sm:p-2 flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="lg:hidden p-2 sm:p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 touch-manipulation min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center flex-shrink-0 mobile-menu-toggle"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu with Enhanced Responsiveness */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsMenuOpen(false)}></div>
            {/* Menu */}
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-200 mobile-menu-container z-50">
            <div className="px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Mobile Search */}
              <div className="mb-4">
                <form onSubmit={handleMobileSearch} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base touch-manipulation"
                  />
                </form>
              </div>
              
              {/* Navigation Links */}
              <div className="space-y-1">
                <Link 
                  to="/makeup" 
                  className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-300 touch-manipulation min-h-[44px] flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Makeup
                </Link>
                <Link 
                  to="/skincare" 
                  className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-300 touch-manipulation min-h-[44px] flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Skincare
                </Link>
                <Link 
                  to="/haircare" 
                  className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-300 touch-manipulation min-h-[44px] flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Haircare
                </Link>
                <Link 
                  to="/fragrance" 
                  className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-300 touch-manipulation min-h-[44px] flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Fragrance
                </Link>
                <Link 
                  to="/new-arrivals" 
                  className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-300 touch-manipulation min-h-[44px] flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  New Arrivals
                </Link>
              </div>
              
              {/* Auth Links */}
              {!user && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
                  <Link 
                    to="/login" 
                    className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300 touch-manipulation min-h-[44px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300 touch-manipulation min-h-[44px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          </>
        )}
      </div>
    </nav>
  );
}