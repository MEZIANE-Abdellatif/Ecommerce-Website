import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        text: "Pending",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        icon: "⏳",
      },
      paid: {
        text: "Paid",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        icon: "💳",
      },
      delivered: {
        text: "Delivered",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        icon: "✅",
      },
      cancelled: {
        text: "Cancelled",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        icon: "❌",
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getPaymentMethodDisplay = (method) => {
    const methodMap = {
      blik: "BLIK",
      przelewy24: "Przelewy24",
      cod: "Cash on Delivery",
      paypal: "PayPal",
      card: "Credit Card",
    };
    return methodMap[method] || method || "Not specified";
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <button
          onClick={() => navigate("/my-orders")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/my-orders")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
          <button
            onClick={() => navigate("/my-orders")}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Back to Orders
          </button>
        </div>
        
        {/* Order Status */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Order #{order._id.slice(-8)}</h2>
            <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="text-right">
            {getStatusBadge(order.status || "pending")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
            
            {order.orderItems && order.orderItems.length > 0 ? (
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${item.price?.toFixed(2) || "0.00"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No items found in this order.</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h3>
            {order.shippingAddress ? (
              <div className="space-y-2">
                <p className="text-gray-900">
                  <span className="font-medium">Address:</span> {order.shippingAddress.address}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">City:</span> {order.shippingAddress.city}
                </p>
                {order.shippingAddress.postalCode && (
                  <p className="text-gray-900">
                    <span className="font-medium">Postal Code:</span> {order.shippingAddress.postalCode}
                  </p>
                )}
                {order.shippingAddress.country && (
                  <p className="text-gray-900">
                    <span className="font-medium">Country:</span> {order.shippingAddress.country}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No shipping information available.</p>
            )}
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
            <div className="space-y-2">
              <p className="text-gray-900">
                <span className="font-medium">Method:</span> {getPaymentMethodDisplay(order.paymentMethod)}
              </p>
              {order.isPaid && order.paidAt && (
                <p className="text-gray-900">
                  <span className="font-medium">Paid on:</span> {formatDate(order.paidAt)}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${order.totalPrice?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>${order.totalPrice?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/my-orders")}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
} 