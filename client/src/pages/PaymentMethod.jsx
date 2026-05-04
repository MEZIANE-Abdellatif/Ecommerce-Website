import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { API_ENDPOINTS, STRIPE_PUBLISHABLE_KEY } from "../config/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import axios from "axios";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function StripePaymentForm({ orderId: _orderId, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message);
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleStripeSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="group relative w-full min-h-[44px] py-4 px-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function PaymentMethod() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart, getCartTotal } = useCart();
  
  // Get shipping data from navigation state
  const shippingData = location.state?.shippingAddress;
  const shippingMethodData = location.state?.shippingMethod;
  
  // Debug: Log shipping data received
  console.log("Shipping data received from Checkout:", shippingData);
  console.log("Shipping method received:", shippingMethodData);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      navigate("/login");
      return;
    }

    // Validate shipping address exists
    if (!shippingData || !shippingData.address || !shippingData.city) {
      alert("Please complete the checkout form first");
      navigate("/checkout");
      return;
    }

    setLoading(false);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [navigate, shippingData]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setStripeLoading(true);
    setError("");
    setStripeError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      const orderData = {
        orderItems: cart.map((item) => ({
          name: item.name,
          qty: item.quantity || 1,
          image: item.images?.[0] || item.image || "https://via.placeholder.com/300x200",
          price:
            typeof item.price === "string"
              ? parseFloat(item.price.replace(/[^\d.]/g, ""))
              : parseFloat(item.price),
        })),
        shippingAddress: {
          fullName: shippingData?.fullName || userData?.name || "",
          address: shippingData?.address || "",
          city: shippingData?.city || "",
          postalCode: shippingData?.postalCode || "",
          state: shippingData?.state || "",
          country: "Poland",
        },
        paymentMethod: "stripe",
        shippingMethod: shippingMethodData || "standard",
        totalPrice: getCartTotal(),
      };

      console.log("Creating order with data:", orderData);

      const { data: createdOrder } = await axios.post(
        API_ENDPOINTS.ORDERS,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { data: intentPayload } = await axios.post(
        API_ENDPOINTS.CREATE_PAYMENT_INTENT(createdOrder._id),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!intentPayload?.clientSecret) {
        setStripeError("Payment could not be initialized. Please try again.");
        return;
      }

      setOrderId(createdOrder._id);
      setClientSecret(intentPayload.clientSecret);
    } catch (err) {
      console.error("Error creating order or payment intent:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to start checkout. Please try again.";
      const url = err.config?.url || "";
      if (url.includes("create-payment-intent")) {
        setStripeError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
      setStripeLoading(false);
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
          <p className="text-lg text-gray-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

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
            Payment
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Confirm your order, then pay with Stripe — choose card, BLIK, or other options Stripe offers for your order.
          </p>
          <p className="text-sm text-gray-500 mt-2 italic">
            * No duplicate method selection here; you pick how to pay only in the secure Stripe step
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
                <span className="truncate">
                  {clientSecret ? "Complete payment" : "Confirm & continue"}
                </span>
              </h3>

              {(error || stripeError) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error || stripeError}
                  </div>
                </div>
              )}

              {!clientSecret ? (
              <form onSubmit={handleCreateOrder}>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Click below to create your order and open Stripe. You will choose card, BLIK, or bank transfer there — not on this page.
                </p>

                {/* Place Order Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={submitting || stripeLoading}
                    className="group relative w-full min-h-[44px] py-4 px-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center">
                      {submitting || stripeLoading ? (
                        <>
                          <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Preparing payment...
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
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm
                    orderId={orderId}
                    onSuccess={() => {
                      clearCart();
                      localStorage.removeItem("paymentMethod");
                      navigate("/success");
                    }}
                    onError={(msg) => {
                      setStripeError(null);
                      setError(msg);
                    }}
                  />
                </Elements>
              )}
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

                {/* Payment via Stripe */}
                <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-200 my-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-700">Checkout:</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-full text-center">
                      Stripe
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Method (card, BLIK, …) is chosen in the Stripe step only.</p>
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