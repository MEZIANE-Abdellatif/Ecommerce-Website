import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export default function Checkout() {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
    country: "",
    shippingMethod: "standard",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!userData || !token) {
      // Redirect unauthenticated users to login
      alert("Please log in or register (and verify your email) to complete your order.");
      navigate("/login");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData(prev => ({
        ...prev,
        email: parsedUser.email || "",
        fullName: parsedUser.name || "",
        address: parsedUser.defaultAddress?.street || "",
        city: parsedUser.defaultAddress?.city || "",
        postalCode: parsedUser.defaultAddress?.postalCode || "",
        state: parsedUser.defaultAddress?.state || "",
        country: parsedUser.defaultAddress?.country || ""
      }));
    } catch (error) {
      console.error("Error parsing user data:", error);
      // If user data is corrupted, redirect to login
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      alert("Please log in or register (and verify your email) to complete your order.");
      navigate("/login");
      return;
    }

    // Check if payment method is selected
    const selectedPaymentMethod = localStorage.getItem("paymentMethod");
    setPaymentMethod(selectedPaymentMethod || "");

    // Scroll to top
    window.scrollTo(0, 0);
  }, [location, navigate]);

  // If no user, don't render the checkout form
  if (!user) {
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      alert("Please select a payment method first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const orderData = {
        orderItems: cart.map(item => ({
          product: item._id || item.id,
          name: item.name,
          price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, "")) : parseFloat(item.price),
          quantity: item.quantity || 1
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          state: formData.state,
          country: formData.country
        },
        paymentMethod: paymentMethod,
        shippingMethod: formData.shippingMethod,
        totalPrice: finalTotal,
        shippingCost: shippingCost
      };

      const response = await fetch("https://ecommerce-website-iwrz.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        // Clear cart and redirect to success page
        localStorage.removeItem("cart");
        localStorage.removeItem("paymentMethod");
        navigate(`/order-success/${order._id}`);
      } else {
        const error = await response.json();
        alert(`Order failed: ${error.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const total = getCartTotal();
  const shippingCost = formData.shippingMethod === "express" ? 5 : 0;
  const finalTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-200 to-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4 shadow-lg">
            <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-3">
            Complete Your Order
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            You're just a few steps away from receiving your amazing Mazzinka products!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              {/* User Info Banner */}
              <div className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base sm:text-lg font-bold text-gray-900 truncate">Welcome back, {user.name}!</p>
                    <p className="text-pink-600 font-medium text-sm sm:text-base truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Shipping Information
              </h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400"
                        placeholder="your.email@example.com"
                        readOnly={!!user}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400"
                        placeholder="Your full name"
                        readOnly={!!user}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
                    Street Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400"
                      placeholder="Street, house/apartment number"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400"
                      placeholder="City name"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
                      Postal Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400"
                        placeholder="Postal/ZIP code"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
                      State/Province
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400"
                        placeholder="State or Province"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
                    Country
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400"
                      placeholder="Country"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-pink-600 transition-colors">
                    Shipping Method
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border-2 border-gray-200 hover:border-pink-300 transition-all duration-300 cursor-pointer group/shipping">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={formData.shippingMethod === "standard"}
                        onChange={handleChange}
                        className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">Standard Delivery</span>
                          <span className="text-pink-600 font-bold">Free</span>
                        </div>
                        <p className="text-sm text-gray-600">3-5 business days</p>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover/shipping:opacity-100 transition-opacity duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border-2 border-gray-200 hover:border-pink-300 transition-all duration-300 cursor-pointer group/shipping">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={formData.shippingMethod === "express"}
                        onChange={handleChange}
                        className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">Express Delivery</span>
                          <span className="text-pink-600 font-bold">+$5.00</span>
                        </div>
                        <p className="text-sm text-gray-600">1-2 business days</p>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover/shipping:opacity-100 transition-opacity duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/payment-method")}
                    className="group relative w-full py-4 px-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Choose Payment Method
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                  Order Summary
                </h3>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id || item.id} className="flex items-center space-x-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-pink-100">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                      <p className="font-bold text-pink-600">
                        ${((typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, "")) : parseFloat(item.price)) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-pink-200 pt-3 flex justify-between text-xl font-bold">
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Total</span>
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Method Display */}
                {paymentMethod && (
                  <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Payment Method:</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-full">
                                                 {paymentMethod === "blik" ? "BLIK" : 
                          paymentMethod === "card" ? "Card Payment" : paymentMethod}
                      </span>
                    </div>
                  </div>
                )}

                {/* Trust Indicators */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Secure Checkout
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      SSL Encrypted
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Fast Delivery
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      24/7 Support
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mt-6"
                >
                  Complete Order - ${finalTotal.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 