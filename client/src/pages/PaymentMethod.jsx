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
          image: item.image,
          price: parseFloat(item.price.replace(/[^\d.]/g, ""))
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
        "http://localhost:5000/api/orders",
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: "blik",
      name: "BLIK",
      description: "Fast mobile payment",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "przelewy24",
      name: "Przelewy24",
      description: "Secure online payments",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay with cash upon delivery",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const total = getCartTotal();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Choose Payment Method
          </h1>
          <p className="text-gray-600">
            Select a convenient payment method for you
          </p>
        </div>

        {/* Payment Methods Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => handleMethodChange(method.id)}
                    className="sr-only"
                  />
                  
                  {/* Custom Radio Button */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-200 ${
                    selectedMethod === method.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>

                  {/* Method Icon */}
                  <div className={`p-2 rounded-lg mr-4 transition-colors duration-200 ${
                    selectedMethod === method.id
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {method.icon}
                  </div>

                  {/* Method Details */}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {method.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {method.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Order Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {selectedMethod === "blik" ? "BLIK" : 
                     selectedMethod === "przelewy24" ? "Przelewy24" : 
                     selectedMethod === "cod" ? "Cash on Delivery" : selectedMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-xl transition-colors duration-200 font-semibold w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Order...
                  </div>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/checkout")}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
          >
            ← Back to Checkout
          </button>
        </div>
      </div>
    </div>
  );
} 