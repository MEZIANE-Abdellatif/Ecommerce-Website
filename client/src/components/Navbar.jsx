import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const location = useLocation();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded hover:bg-blue-100 transition-colors ${
        location.pathname === to ? "text-blue-600 font-bold" : "text-gray-700"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <nav className="w-full py-4 bg-white shadow fixed top-0 left-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            {navLink("/", "Home")}
            {navLink("/products", "Products")}
          </div>
          <div>
            <Link
              to="/cart"
              className="relative px-3 py-2 rounded hover:bg-blue-100 transition-colors text-gray-700"
            >
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
      {/* Spacer to prevent content from being hidden behind the fixed navbar */}
      <div className="h-20" />
    </>
  );
} 