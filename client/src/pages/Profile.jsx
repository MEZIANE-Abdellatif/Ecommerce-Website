import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Consistent tab wrapper for uniform width behavior across all tabs
const TabWrap = ({ children }) => (
  <div className="w-full max-w-[19rem] mx-auto sm:max-w-[23rem] md:max-w-lg lg:max-w-full">
    {children}
  </div>
);

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteItems: 0,
    memberSince: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        navigate("/login");
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      if (!parsedUser || !parsedUser.name || !parsedUser.email) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      
      setUser(parsedUser);
      
      // Load user data
      loadUserData(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const loadUserData = async (userData) => {
    // Load favorites
    const userFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(userFavorites);
    
    // Load orders from API
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch("http://localhost:5000/api/orders/myorders", {
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
            items: order.orderItems.length,
            orderItems: order.orderItems.map(item => ({
              product: {
                name: item.name,
                image: item.image,
                price: item.price
              },
              quantity: item.qty
            })),
            shippingAddress: {
              street: order.shippingAddress.address,
              city: order.shippingAddress.city,
              state: order.shippingAddress.postalCode,
              zipCode: order.shippingAddress.postalCode,
              country: order.shippingAddress.country
            },
            paymentMethod: order.paymentMethod
          }));
          setOrders(transformedOrders);
          
          // Calculate stats
          const totalSpent = transformedOrders.reduce((sum, order) => sum + order.total, 0);
          setStats({
            totalOrders: transformedOrders.length,
            totalSpent: totalSpent,
            favoriteItems: userFavorites.length,
            memberSince: new Date(userData.createdAt || Date.now()).toLocaleDateString()
          });
        } else {
          console.error("Failed to fetch orders:", response.statusText);
          // Fallback to empty orders
          setOrders([]);
          setStats({
            totalOrders: 0,
            totalSpent: 0,
            favoriteItems: userFavorites.length,
            memberSince: new Date(userData.createdAt || Date.now()).toLocaleDateString()
          });
        }
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      // Fallback to empty orders
      setOrders([]);
      setStats({
        totalOrders: 0,
        totalSpent: 0,
        favoriteItems: userFavorites.length,
        memberSince: new Date(userData.createdAt || Date.now()).toLocaleDateString()
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("favorites");
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Processing": return "bg-yellow-100 text-yellow-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewOrderDetails = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setActiveTab("orders");
    }
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl shadow-2xl mb-6 animate-pulse">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-xl text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screenbg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 w-full">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-300/20 to-rose-300/20 rounded-full animate-float delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-rose-300/20 to-pink-300/20 rounded-full animate-float delay-2000"></div>
      </div>

      {/* Mobile-first responsive layout */}
      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header - Mobile optimized */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-2">
            {stats.totalOrders > 0 ? `Welcome Back, ${user.name.split(' ')[0]}!` : `Welcome, ${user.name.split(' ')[0]}!`}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            {stats.totalOrders > 0 ? 'Manage your account, orders, and preferences' : 'Complete your profile and start shopping'}
          </p>
        </div>

        {/* Mobile-first layout: Stack sidebar on top, then side-by-side on lg+ */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Sidebar - Mobile: full width, Desktop: fixed width */}
            <div className="w-full lg:w-72 xl:w-80 lg:shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-3xl blur-2xl transform rotate-1"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/30">
                  {/* Profile Info */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                      <span className="text-xl sm:text-2xl font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{user.name}</h3>
                    <p className="text-gray-600 text-sm break-all">{user.email}</p>
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.isSuperAdmin ? 'bg-purple-100 text-purple-800' :
                        user.isAdmin ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.isSuperAdmin ? "Super Admin" : user.isAdmin ? "Admin" : "Member"}
                      </span>
                    </div>
                  </div>

                  {/* Navigation - Mobile optimized */}
                  <nav className="space-y-2">
                    {[
                      { id: "overview", label: "Overview", icon: "📊" },
                      { id: "orders", label: "My Orders", icon: "📦" },
                      { id: "favorites", label: "Favorites", icon: "❤️" },
                      { id: "settings", label: "Settings", icon: "⚙️" },
                      { id: "security", label: "Security", icon: "🔒" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-2xl transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg ring-2 ring-pink-400 ring-offset-2 ring-offset-white'
                            : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                        }`}
                      >
                        <span className="text-base sm:text-lg">{tab.icon}</span>
                        <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                      </button>
                    ))}
                  </nav>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full mt-4 sm:mt-6 flex items-center justify-center space-x-2 px-3 sm:px-4 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium text-sm sm:text-base">Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area - Mobile: full width, Desktop: flexible */}
            <div className="w-full lg:flex-1 lg:min-w-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-3xl blur-2xl transform rotate-1"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/30">
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <TabWrap>
                      <div className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Account Overview</h2>
                        
                        {/* Stats Cards - Mobile-first responsive grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {/* Total Orders */}
                          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                              </div>
                              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Favorites */}
                          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-500 text-sm font-medium">Favorites</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.favoriteItems}</p>
                              </div>
                              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Last Order Status */}
                          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between ">
                              <div>
                                <p className="text-gray-500 text-sm font-medium">Last Order</p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {orders.length > 0 ? `${orders[0].id.slice(0, 12)}...` : 'No orders'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {orders.length > 0 ? orders[0].date : ''}
                                </p>
                              </div>
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            {orders.length > 0 && (
                              <div className="mt-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orders[0].status)}`}>
                                  {orders[0].status}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Recent Order Section - Mobile responsive */}
                        {orders.length > 0 && (
                          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Recent Order</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-800 truncate">Order #{orders[0].id}</p>
                                <p className="text-sm text-gray-500">Placed on {orders[0].date}</p>
                                <p className="text-sm text-gray-500">{orders[0].items} items • ${orders[0].total}</p>
                              </div>
                              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orders[0].status)}`}>
                                  {orders[0].status}
                                </span>
                                <button 
                                  onClick={() => handleViewOrderDetails(orders[0].id)}
                                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg w-full sm:w-auto"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Continue Shopping Button */}
                        <div className="text-center pt-4">
                          <button
                            onClick={() => navigate("/")}
                            className="px-6 sm:px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    </TabWrap>
                  )}

                  {/* Orders Tab */}
                  {activeTab === "orders" && (
                    <TabWrap>
                      <div className="space-y-6 w-full">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Order History</h2>
                        
                        {orders.length === 0 ? (
                          <div className="text-center py-8 sm:py-12">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
                            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                            <button
                              onClick={() => navigate("/")}
                              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105"
                            >
                              Start Shopping
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {orders.map((order) => (
                              <div key={order.id} className="bg-white rounded-2xl p-3 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                                  <div className="min-w-0 flex-1">
                                    <h3 className="text-sm sm:text-lg font-bold text-gray-800 truncate">Order #{order.id}</h3>
                                    <p className="text-xs sm:text-base text-gray-600 truncate">Placed on {order.date}</p>
                                  </div>
                                  <div className="text-left sm:text-right flex-shrink-0">
                                    <p className="text-lg sm:text-2xl font-bold text-gray-800">${order.total}</p>
                                    <p className="text-xs sm:text-base text-gray-600">{order.items} items</p>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                                  <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)} w-fit`}>
                                    {order.status}
                                  </span>
                                  <button 
                                    onClick={() => handleViewOrderDetails(order.id)}
                                    className="px-3 sm:px-4 py-2 text-pink-600 hover:text-pink-700 font-medium transition-all duration-500 ease-in-out hover:bg-pink-50 rounded-lg w-full sm:w-auto text-sm sm:text-base transform hover:scale-105 hover:shadow-md"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Order Details Section - Mobile responsive with dropdown animation */}
                        {selectedOrder && (
                          <div className="mt-8 bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 w-full animate-fade-in-down">
                            <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 truncate flex-1 min-w-0">Order Details - #{selectedOrder.id}</h3>
                              <button
                                onClick={handleCloseOrderDetails}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                              >
                                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full">
                              {/* Order Items */}
                              <div className="w-full">
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Order Items</h4>
                                <div className="space-y-3 sm:space-y-4 w-full">
                                  {selectedOrder.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl w-full">
                                      <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <h5 className="font-medium text-gray-800 text-sm sm:text-base truncate">{item.product.name}</h5>
                                        <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        <p className="text-sm sm:text-lg font-semibold text-pink-600">${item.product.price}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Order Information */}
                              <div className="space-y-4 sm:space-y-6 w-full">
                                {/* Order Summary */}
                                <div className="w-full">
                                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Order Summary</h4>
                                  <div className="bg-gray-50 rounded-xl p-4 space-y-3 w-full">
                                    <div className="flex justify-between text-sm sm:text-base">
                                      <span className="text-gray-600">Order Date:</span>
                                      <span className="font-medium">{selectedOrder.date}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm sm:text-base">
                                      <span className="text-gray-600">Status:</span>
                                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base">
                                      <span className="text-gray-600">Items:</span>
                                      <span className="font-medium">{selectedOrder.items}</span>
                                    </div>
                                    <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-gray-200">
                                      <span>Total:</span>
                                      <span className="text-pink-600">${selectedOrder.total}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="w-full">
                                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Shipping Address</h4>
                                  <div className="bg-gray-50 rounded-xl p-4 w-full">
                                    <p className="font-medium text-gray-800 text-sm sm:text-base">{selectedOrder.shippingAddress.street}</p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">{selectedOrder.shippingAddress.country}</p>
                                  </div>
                                </div>

                                {/* Payment Method */}
                                <div className="w-full">
                                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Payment Method</h4>
                                  <div className="bg-gray-50 rounded-xl p-4 w-full">
                                    <p className="font-medium text-gray-800 text-sm sm:text-base">{selectedOrder.paymentMethod}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabWrap>
                  )}

                  {/* Favorites Tab */}
                  {activeTab === "favorites" && (
                    <TabWrap>
                      <div className="space-y-6 w-full">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Favorites</h2>
                        
                        {favorites.length === 0 ? (
                          <div className="text-center py-8 sm:py-12">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Favorites Yet</h3>
                            <p className="text-gray-600 mb-6">Start adding products to your favorites</p>
                            <button
                              onClick={() => navigate("/")}
                              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105"
                            >
                              Discover Products
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favorites.map((product) => (
                              <div key={product._id} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base line-clamp-2">{product.name}</h3>
                                <p className="text-xl sm:text-2xl font-bold text-pink-600 mb-3">${product.price}</p>
                                <button
                                  onClick={() => navigate(`/products/${product._id}`)}
                                  className="w-full py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-medium"
                                >
                                  View Product
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabWrap>
                  )}

                  {/* Settings Tab */}
                  {activeTab === "settings" && (
                    <TabWrap>
                      <div className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Account Settings</h2>
                        
                        <div className="space-y-6">
                          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                  type="text"
                                  value={user.name}
                                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                  readOnly
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                  type="email"
                                  value={user.email}
                                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                  readOnly
                                />
                              </div>
                            </div>
                            
                            {/* Address Section */}
                            <div className="mt-6">
                              <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Default Address</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="sm:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                  <input
                                    type="text"
                                    value={user.defaultAddress?.street || ""}
                                    onChange={(e) => {
                                      const updatedUser = { ...user };
                                      if (!updatedUser.defaultAddress) updatedUser.defaultAddress = {};
                                      updatedUser.defaultAddress.street = e.target.value;
                                      setUser(updatedUser);
                                      localStorage.setItem("user", JSON.stringify(updatedUser));
                                    }}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                    placeholder="Street, house/apartment number"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                  <input
                                    type="text"
                                    value={user.defaultAddress?.city || ""}
                                    onChange={(e) => {
                                      const updatedUser = { ...user };
                                      if (!updatedUser.defaultAddress) updatedUser.defaultAddress = {};
                                      updatedUser.defaultAddress.city = e.target.value;
                                      setUser(updatedUser);
                                      localStorage.setItem("user", JSON.stringify(updatedUser));
                                    }}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                    placeholder="City name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                                  <input
                                    type="text"
                                    value={user.defaultAddress?.postalCode || ""}
                                    onChange={(e) => {
                                      const updatedUser = { ...user };
                                      if (!updatedUser.defaultAddress) updatedUser.defaultAddress = {};
                                      updatedUser.defaultAddress.postalCode = e.target.value;
                                      setUser(updatedUser);
                                      localStorage.setItem("user", JSON.stringify(updatedUser));
                                    }}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                    placeholder="Postal/ZIP code"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                                  <input
                                    type="text"
                                    value={user.defaultAddress?.state || ""}
                                    onChange={(e) => {
                                      const updatedUser = { ...user };
                                      if (!updatedUser.defaultAddress) updatedUser.defaultAddress = {};
                                      updatedUser.defaultAddress.state = e.target.value;
                                      setUser(updatedUser);
                                      localStorage.setItem("user", JSON.stringify(updatedUser));
                                    }}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                    placeholder="State or Province"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                  <input
                                    type="text"
                                    value={user.defaultAddress?.country || ""}
                                    onChange={(e) => {
                                      const updatedUser = { ...user };
                                      if (!updatedUser.defaultAddress) updatedUser.defaultAddress = {};
                                      updatedUser.defaultAddress.country = e.target.value;
                                      setUser(updatedUser);
                                      localStorage.setItem("user", JSON.stringify(updatedUser));
                                    }}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                    placeholder="Country"
                                  />
                                </div>
                              </div>
                            </div>
                            <button className="mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-medium">
                              Edit Profile
                            </button>
                          </div>

                          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Preferences</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm sm:text-base text-gray-700">Email Notifications</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="text-sm sm:text-base text-gray-700">SMS Notifications</span>
                                  <span className="text-xs text-gray-500">(Disabled in demo version)</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-not-allowed opacity-50">
                                  <input type="checkbox" className="sr-only peer" disabled />
                                  <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                                </label>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm sm:text-base text-gray-700">Marketing Emails</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabWrap>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <TabWrap>
                      <div className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Security Settings</h2>
                        
                        <div className="space-y-6">
                          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Change Password</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <input
                                  type="password"
                                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                  placeholder="Enter current password"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                  type="password"
                                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                  placeholder="Enter new password"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                  type="password"
                                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                  placeholder="Confirm new password"
                                />
                              </div>
                              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-medium">
                                Update Password
                              </button>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Two-Factor Authentication</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mb-3 italic">* Not enabled in demo version</p>
                            <p className="text-sm sm:text-base text-gray-600 mb-4">Add an extra layer of security to your account</p>
                            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-medium">
                              Enable 2FA
                            </button>
                          </div>
                        </div>
                      </div>
                    </TabWrap>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}