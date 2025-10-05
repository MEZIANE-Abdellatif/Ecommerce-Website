import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import axios from "axios";

export default function PaymentMethod() {
  const [selectedMethod, setSelectedMethod] = useState("blik");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { cart, clearCart, getCartTotal } = useCart();

  // Add custom CSS for smooth slide-down animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        0% {
          opacity: 0;
          transform: translateY(-30px) scale(0.9);
          max-height: 0;
        }
        30% {
          opacity: 0.3;
          transform: translateY(-15px) scale(0.95);
          max-height: 100px;
        }
        60% {
          opacity: 0.7;
          transform: translateY(-5px) scale(0.98);
          max-height: 300px;
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
          max-height: 1000px;
        }
      }
      
      .animate-slideDown {
        animation: slideDown 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        transform-origin: top;
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.4s ease-out 0.15s both;
      }
      
      @keyframes fadeIn {
        0% {
          opacity: 0;
          transform: translateY(10px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      navigate("/login");
      return;
    }

    // Load previously selected method from localStorage
    const savedMethod = localStorage.getItem("paymentMethod");
    if (savedMethod) {
      setSelectedMethod(savedMethod);
    }

    setLoading(false);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [navigate]);

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    setError(""); // Clear error when user makes a selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMethod) {
      setError("Please select a payment method!");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Prepare order data
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.quantity || 1,
          image: item.images?.[0] || item.image || "https://via.placeholder.com/300x200",
          price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, "")) : parseFloat(item.price)
        })),
        shippingAddress: {
          address: "Sample Address", // You can get this from checkout form
          city: "Sample City",
          postalCode: "12345",
          country: "Sample Country"
        },
        paymentMethod: selectedMethod,
        totalPrice: getCartTotal()
      };

      // Create order via API
      await axios.post(
        "https://ecommerce-website-iwrz.onrender.com/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Clear cart and payment method
      clearCart();
      localStorage.removeItem("paymentMethod");
      
      setSubmitting(false);
      navigate("/success");
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error.response?.data?.message || "Failed to create order. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4 shadow-2xl">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-lg text-gray-600 font-medium">Loading payment options...</p>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: "blik",
      name: "BLIK",
      description: "Fast mobile payment with instant confirmation",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      features: ["Instant payment", "Mobile app", "Secure"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "card",
      name: "Card Payment",
      description: "Secure credit and debit card payments",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      features: ["Visa & Mastercard", "Secure processing", "Instant confirmation"],
      color: "from-green-500 to-emerald-500"
    },
  ];

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-200 to-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-3">
            Choose Payment Method
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Select the most convenient and secure payment option for your Mazzinka order!
          </p>
          <p className="text-sm text-gray-500 mt-2 italic">
            * Payment backend integration is not active in demo version
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <h3 className="text-lg sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-900 flex items-center">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </span>
                <span className="truncate">Available Payment Options</span>
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className="group relative block cursor-pointer transition-all duration-300"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={() => handleMethodChange(method.id)}
                        className="sr-only"
                      />
                      
                      <div className={`relative p-4 sm:p-6 bg-white/70 backdrop-blur-sm rounded-2xl transition-all duration-300 ${
                        selectedMethod === method.id
                          ? 'bg-gradient-to-r from-pink-50 to-rose-50 shadow-xl'
                          : 'hover:shadow-md'
                      }`}>
                        {/* Selection Indicator */}
                        <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          selectedMethod === method.id
                            ? 'border-pink-500 bg-pink-500 scale-110'
                            : 'border-gray-300 scale-100'
                        }`}>
                          {selectedMethod === method.id && (
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                          {/* Method Icon */}
                          <div className={`p-2 sm:p-3 rounded-xl transition-all duration-300 flex-shrink-0 self-center sm:self-start ${
                            selectedMethod === method.id
                              ? `bg-gradient-to-r ${method.color} text-white shadow-lg`
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <div className="w-6 h-6 sm:w-8 sm:h-8">
                              {method.icon}
                            </div>
                          </div>

                          {/* Method Details */}
                          <div className="flex-1 min-w-0 text-center sm:text-left">
                            <div className="font-bold text-lg sm:text-xl text-gray-900 mb-2 truncate">
                              {method.name}
                            </div>
                            <div className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                              {method.description}
                            </div>
                            
                            {/* Features */}
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
                              {method.features.map((feature, index) => (
                                <span key={index} className="px-2 sm:px-3 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Dynamic Payment Forms - Appear under selected card */}
                      {selectedMethod === method.id && (
                        <div className="mt-4 animate-slideDown overflow-hidden">
                          {method.id === "blik" && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 animate-fadeIn">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">BLIK Payment</h3>
                                  <p className="text-xs sm:text-sm text-gray-600">Enter your 6-digit BLIK code</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">BLIK Code</label>
                                  <input
                                    type="text"
                                    placeholder="123456"
                                    maxLength="6"
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-center text-xl font-mono tracking-widest"
                                  />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-500">
                                    Open your banking app and generate a BLIK code
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {method.id === "card" && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 animate-fadeIn">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">Card Payment</h3>
                                  <p className="text-xs sm:text-sm text-gray-600">Enter your card details securely</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                                  <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 font-mono"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                                    <input
                                      type="text"
                                      placeholder="MM/YY"
                                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-center"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                                    <input
                                      type="text"
                                      placeholder="123"
                                      maxLength="4"
                                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-center"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                                  <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                  />
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Your payment information is encrypted and secure</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </label>
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                {/* Place Order Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative w-full py-4 px-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center">
                      {submitting ? (
                        <>
                          <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Creating Your Order...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Complete Order
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>


          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                  Order Summary
                </h3>
                
                {/* Cart Items Preview */}
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                  {cart.slice(0, 3).map((item) => (
                    <div key={item._id || item.id} className="flex items-center space-x-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-pink-100">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                      <p className="font-bold text-pink-600 text-sm">
                        ${((typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, "")) : parseFloat(item.price)) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <div className="text-center py-2 text-sm text-gray-500">
                      +{cart.length - 3} more items
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="border-t border-pink-200 pt-3 flex justify-between text-xl font-bold">
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Total</span>
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Selected Payment Method */}
                <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-200 my-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Payment Method:</span>
                                         <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-full">
                       {selectedMethod === "blik" ? "BLIK" : 
                        selectedMethod === "card" ? "Card Payment" : selectedMethod}
                     </span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Secure Payment
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      SSL Encrypted
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="text-center">
                <button
                  onClick={() => navigate("/checkout")}
                  className="group inline-flex items-center px-6 py-3 text-gray-600 hover:text-pink-600 font-medium transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 