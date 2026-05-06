import React, { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import CheckoutAddressForm from "../components/CheckoutAddressForm";

const CheckoutDecorBackground = React.memo(function CheckoutDecorBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-15" />
      <div className="absolute bottom-24 right-10 w-80 h-80 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-15" />
    </div>
  );
});

const CheckoutOrderSummary = React.memo(function CheckoutOrderSummary({
  cart,
  total,
  shippingCost,
  finalTotal,
  paymentMethod
}) {
  return (
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
        </div>
      </div>
    </div>
  );
});

function CheckoutPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      <CheckoutDecorBackground />
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-pulse">
          <div className="inline-block w-12 h-12 bg-gray-200 rounded-full mb-4" />
          <div className="h-9 bg-gray-200 rounded-lg max-w-md mx-auto mb-3" />
          <div className="h-5 bg-gray-100 rounded max-w-sm mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4 animate-pulse">
            <div className="h-48 bg-white/60 rounded-3xl border border-gray-100" />
            <div className="h-64 bg-white/60 rounded-3xl border border-gray-100" />
          </div>
          <div className="lg:col-span-1 animate-pulse">
            <div className="h-96 bg-white/60 rounded-3xl border border-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
    shippingMethod: "standard",
    lat: null,
    lon: null,
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadCheckoutData = async () => {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!userData || !token) {
        setBootstrapping(false);
        alert("Please log in or register (and verify your email) to complete your order.");
        navigate("/login");
        return;
      }

      const finishBootstrap = () => {
        if (cancelled) return;
        const selectedPaymentMethod = localStorage.getItem("paymentMethod");
        setPaymentMethod(selectedPaymentMethod || "");
        window.scrollTo(0, 0);
        setBootstrapping(false);
      };

      try {
        const profileResponse = await fetch(API_ENDPOINTS.PROFILE, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        let latestUser;
        if (profileResponse.ok) {
          latestUser = await profileResponse.json();
          if (!cancelled) setUser(latestUser);
          localStorage.setItem("user", JSON.stringify(latestUser));
        } else {
          latestUser = JSON.parse(userData);
          if (!cancelled) setUser(latestUser);
        }

        const addressData = {
          email: latestUser.email || "",
          fullName: latestUser.name || "",
          address: latestUser.defaultAddress?.street || "",
          city: latestUser.defaultAddress?.city || "",
          postalCode: latestUser.defaultAddress?.postalCode || "",
          state: latestUser.defaultAddress?.state || ""
        };

        if (!cancelled) {
          setFormData(prev => ({
            ...prev,
            ...addressData
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        try {
          const parsedUser = JSON.parse(userData);
          if (!cancelled) {
            setUser(parsedUser);
            setFormData(prev => ({
              ...prev,
              email: parsedUser.email || "",
              fullName: parsedUser.name || "",
              address: parsedUser.defaultAddress?.street || "",
              city: parsedUser.defaultAddress?.city || "",
              postalCode: parsedUser.defaultAddress?.postalCode || "",
              state: parsedUser.defaultAddress?.state || ""
            }));
          }
        } catch {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setBootstrapping(false);
          alert("Please log in or register (and verify your email) to complete your order.");
          navigate("/login");
          return;
        }
      }

      finishBootstrap();
    };

    loadCheckoutData();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const total = getCartTotal();
  const shippingCost = formData.shippingMethod === "express" ? 5 : 0;
  const finalTotal = total + shippingCost;

  const goToPayment = useCallback(() => {
    navigate("/payment-method", {
      state: {
        shippingAddress: formData,
        shippingMethod: formData.shippingMethod
      }
    });
  }, [navigate, formData]);

  if (bootstrapping) {
    return <CheckoutPageSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      <CheckoutDecorBackground />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
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

              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Shipping Information
              </h2>

              <form className="space-y-6">
                <CheckoutAddressForm
                  formData={formData}
                  setFormData={setFormData}
                  user={user}
                />

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={goToPayment}
                    className="group relative w-full py-4 px-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl min-h-[44px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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

          <CheckoutOrderSummary
            cart={cart}
            total={total}
            shippingCost={shippingCost}
            finalTotal={finalTotal}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </div>
  );
}
