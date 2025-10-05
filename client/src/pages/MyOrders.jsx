import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("https://ecommerce-website-iwrz.onrender.com/api/orders/myorders", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const ordersData = await response.json();
        // Transform backend data to match frontend format
        const transformedOrders = ordersData.map(order => ({
          id: order._id,
          date: new Date(order.createdAt).toLocaleDateString(),
          status: order.isDelivered ? "Delivered" : order.isPaid ? "Processing" : "Pending",
          total: order.totalPrice,
          items: order.orderItems.length
        }));
        setOrders(transformedOrders);
      } else {
        setError("Failed to load orders. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
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
    });
  };

  const shortenOrderId = (orderId) => {
    return orderId.length > 12 ? orderId.substring(0, 12) + "..." : orderId;
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
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
            <p className="mt-2 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
        <p className="text-gray-600">View and track your order history</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            You don't have any orders yet.
          </h3>
          <p className="text-gray-600 mb-6">
            Start shopping to see your orders here.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Order ID */}
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Order ID</p>
                      <p className="text-gray-900 font-mono text-sm">
                        {shortenOrderId(order._id)}
                      </p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Date</p>
                      <p className="text-gray-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Payment</p>
                      <p className="text-gray-900">
                        {getPaymentMethodDisplay(order.paymentMethod)}
                      </p>
                    </div>

                    {/* Total Price */}
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Total</p>
                      <p className="text-gray-900 font-semibold">
                        ${order.totalPrice?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                    {getStatusBadge(order.status || "pending")}
                  </div>
                </div>

                {/* View Details Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
        >
          ← Back
        </button>
      </div>
    </div>
  );
} 