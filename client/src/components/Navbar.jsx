import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export default function Navbar() {
  const { getCartItemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const itemCount = getCartItemCount();
  const [user, setUser] = useState(null);

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
  }, [location.pathname]); // Re-run when location changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("user");
    localStorage.removeItem("paymentMethod");
    setUser(null);
    navigate("/");
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded hover:bg-blue-100 transition-colors ${
        location.pathname === to ? "text-blue-600 font-semibold" : "text-gray-700"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full py-4 bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            E-Shop
          </Link>
          <div className="flex items-center space-x-4">
            {navLink("/", "Home")}
            {navLink("/products", "Products")}
            {user && navLink("/my-orders", "My Orders")}
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative px-3 py-2 rounded hover:bg-blue-100 transition-colors text-gray-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {user ? (
              // Logged in user
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:inline">
                    {user.name}
                  </span>
                </div>
                {navLink("/profile", "Profile")}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded hover:bg-red-100 transition-colors text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Not logged in user
              <div className="flex items-center gap-4">
                {navLink("/login", "Login")}
                {navLink("/register", "Register")}
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="h-20"></div> {/* Spacer for fixed navbar */}
    </>
  );
} 