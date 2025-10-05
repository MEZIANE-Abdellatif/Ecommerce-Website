
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';
import CarouselImageUpload from '../components/CarouselImageUpload';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchCurrentUserProfile = useCallback(async () => {
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        navigate('/');
        return;
      }

      const response = await fetch('https://ecommerce-website-iwrz.onrender.com/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.error('Unauthorized access - token expired or invalid');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      console.log('Dashboard - Fresh user data from API:', userData);
      
      if (!userData.isAdmin && !userData.isSuperAdmin) {
        console.log('Dashboard - User not admin/superadmin, redirecting');
        navigate('/');
        return;
      }
      
      console.log('Dashboard - User is admin/superadmin, setting user state');
      setUser(userData);
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    console.log('Dashboard - User data from localStorage:', userData);
    console.log('Dashboard - Token exists:', !!token);
    
    if (!userData || !token) {
      console.log('Dashboard - No user data or token, redirecting');
      navigate('/');
      return;
    }
    
    // Fetch fresh user data to get latest role information
    fetchCurrentUserProfile();
  }, [navigate, fetchCurrentUserProfile]);

  // Fetch data when active section changes
  useEffect(() => {
    if (user && (user.isAdmin || user.isSuperAdmin)) {
      if (activeSection === 'products') {
        fetchProducts();
      } else if (activeSection === 'orders') {
        fetchOrders();
      } else if (activeSection === 'users') {
        fetchUsers();
      }
    }
  }, [activeSection, user]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setProducts([]);
        return;
      }

      const response = await fetch('https://ecommerce-website-iwrz.onrender.com/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.error('Unauthorized access to products');
        setProducts([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setOrders([]);
        return;
      }

      const response = await fetch('https://ecommerce-website-iwrz.onrender.com/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.error('Unauthorized access to orders');
        setOrders([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('fetchUsers - Token from localStorage:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        console.error('No authentication token found');
        setUsers([]);
        return;
      }

      console.log('fetchUsers - Making API call to /api/users');
      const response = await fetch('https://ecommerce-website-iwrz.onrender.com/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('fetchUsers - Response status:', response.status);
      console.log('fetchUsers - Response headers:', response.headers);

      if (response.status === 401) {
        console.error('Unauthorized access to users');
        setUsers([]);
        return;
      }

      if (response.status === 403) {
        console.error('Forbidden access to users - user might not be admin');
        setUsers([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('fetchUsers - Response data:', data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'products':
        return <ProductsSection products={products} onRefresh={fetchProducts} />;
      case 'orders':
        return <OrdersSection orders={orders} />;
      case 'users':
        return <UsersSection users={users} onRefresh={fetchUsers} />;
      case 'profile':
        return <ProfileSection user={user} />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex">
      {/* Mobile Warning - Only visible on mobile devices */}
      <div className="md:hidden fixed inset-0 z-50 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md mx-4 shadow-2xl border border-pink-200 text-center">
          {/* Laptop Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💻</span>
            </div>
          </div>
          
          {/* Warning Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Dashboard Access
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            For the best dashboard experience, please access this page from your laptop or desktop computer. The dashboard contains complex admin features that work better on larger screens.
          </p>
          
          {/* Features List */}
          <div className="bg-pink-50 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Dashboard Features:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-pink-500">📊</span>
                <span>Analytics & Overview</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-500">📦</span>
                <span>Product Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">📋</span>
                <span>Order Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">👥</span>
                <span>User Management</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Go to Home Page
            </button>
            
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              View Profile
            </button>
          </div>
          
          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-4">
            You can still access your profile and other features on mobile
          </p>
        </div>
      </div>

      {/* Desktop Dashboard Content - Hidden on mobile */}
      <div className="hidden md:flex w-full">
        {/* Left Sidebar */}
        <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-pink-200 flex flex-col">
        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 pt-6">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'products', label: 'Products', icon: '📦' },
            { id: 'orders', label: 'Orders', icon: '📋' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'profile', label: 'Profile', icon: '👤' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>


      </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white/90 backdrop-blur-sm">
          {/* Page Content */}
          <main className="p-8">
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
};

// Overview Section Component
const OverviewSection = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-2">Overview</h1>
        <p className="text-gray-600">Welcome to your Mazzinka dashboard</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-pink-100">Total Revenue</h3>
            <span className="text-pink-100 text-sm">+12.5%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">$24,500</span>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-purple-100">Total Orders</h3>
            <span className="text-purple-100 text-sm">+8.2%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">1,234</span>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📋</span>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-rose-100">Total Products</h3>
            <span className="text-rose-100 text-sm">+15.3%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">456</span>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📦</span>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-indigo-100">Total Users</h3>
            <span className="text-indigo-100 text-sm">+22.1%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">2,847</span>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/90 backdrop-blur-sm border border-pink-200 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-pink-50 rounded-lg">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-pink-600">📦</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New product added</p>
              <p className="text-xs text-gray-500">Radiant Glow Serum was added to inventory</p>
            </div>
            <span className="text-xs text-gray-400">2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600">📋</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Order completed</p>
              <p className="text-xs text-gray-500">Order #1234 was successfully delivered</p>
            </div>
            <span className="text-xs text-gray-400">4 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-rose-50 rounded-lg">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
              <span className="text-rose-600">👥</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New user registered</p>
              <p className="text-xs text-gray-500">Sarah Johnson joined the platform</p>
            </div>
            <span className="text-xs text-gray-400">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Section Component
const ProductsSection = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [newSlide, setNewSlide] = useState({
    imageUrl: ''
  });
  const [editingSlide, setEditingSlide] = useState(null);
  const [showCarouselEditModal, setShowCarouselEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Makeup',
    quantity: '',
    images: []
  });

  // Safety check to ensure products is an array
  const productsArray = Array.isArray(products) ? products : [];

  // Fetch carousel slides when modal opens
  useEffect(() => {
    if (showCarouselModal) {
      fetchCarouselSlides();
    }
  }, [showCarouselModal]);

  const filteredProducts = productsArray.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: 'Makeup',
      quantity: '',
      images: []
    });
  };

  const openEditModal = (product) => {
    setEditingProduct({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      quantity: (product.countInStock || product.stock || 0).toString(),
      images: product.images || []
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Validate required fields
      if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category || newProduct.quantity === '') {
        alert('Please fill in all required fields');
        return;
      }
      
      // Validate price and quantity
      if (parseFloat(newProduct.price) <= 0) {
        alert('Price must be greater than 0');
        return;
      }
      
      if (parseInt(newProduct.quantity) < 0) {
        alert('Quantity must be 0 or greater');
        return;
      }
      
      // Prepare the product data
      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        quantity: parseInt(newProduct.quantity),
        images: newProduct.images || []
      };
      
      console.log('Sending product data:', productData);
      
      const response = await fetch('https://ecommerce-website-iwrz.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Product added successfully:', result);
        closeAddModal();
        // Refresh the page to get updated product data
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Failed to add product:', errorData);
        console.error('Response status:', response.status);
        console.error('Response headers:', response.headers);
        alert(`Failed to add product: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Carousel management functions
  const fetchCarouselSlides = async () => {
    try {
      const response = await fetch('https://ecommerce-website-iwrz.onrender.com/api/carousel/slides');
      if (response.ok) {
        const slides = await response.json();
        setCarouselSlides(slides);
      }
    } catch (error) {
      console.error('Error fetching carousel slides:', error);
    }
  };



  const handleAddSlide = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Validate required fields
      if (!newSlide.imageUrl) {
        alert('Please upload an image');
        return;
      }

      const response = await fetch('https://ecommerce-website-iwrz.onrender.com/api/carousel/slides', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSlide)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Slide added successfully:', result);
        
        // Reset form and refresh slides
        setNewSlide({
          imageUrl: ''
        });
        
        fetchCarouselSlides();
        alert('Slide added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to add slide: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding slide:', error);
      alert('Error adding slide');
    }
  };

  const handleDeleteSlide = async (slideId) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`https://ecommerce-website-iwrz.onrender.com/api/carousel/slides/${slideId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchCarouselSlides();
        alert('Slide deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete slide: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert('Error deleting slide');
    }
  };

  const openEditSlideModal = (slide) => {
    setEditingSlide(slide);
    setShowCarouselEditModal(true);
  };

  const closeEditSlideModal = () => {
    setEditingSlide(null);
    setShowCarouselEditModal(false);
  };

  const handleEditSlide = async () => {
    try {
      if (!editingSlide) return;
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`https://ecommerce-website-iwrz.onrender.com/api/carousel/slides/${editingSlide._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingSlide)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Slide updated successfully:', result);
        closeEditSlideModal();
        fetchCarouselSlides();
        alert('Slide updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update slide: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating slide:', error);
      alert('Error updating slide');
    }
  };

  const handleEditProduct = async () => {
    try {
      if (!editingProduct) return;
      
      const token = localStorage.getItem('token');
      
      // Validate required fields
      if (!editingProduct.name || !editingProduct.description || !editingProduct.price || !editingProduct.category || editingProduct.quantity === '') {
        alert('Please fill in all required fields');
        return;
      }
      
      // Validate price and quantity
      if (parseFloat(editingProduct.price) <= 0) {
        alert('Price must be greater than 0');
        return;
      }
      
      if (parseInt(editingProduct.quantity) < 0) {
        alert('Quantity must be 0 or greater');
        return;
      }
      
      // Prepare the product data
      const productData = {
        name: editingProduct.name.trim(),
        description: editingProduct.description.trim(),
        price: parseFloat(editingProduct.price),
        category: editingProduct.category,
        quantity: parseInt(editingProduct.quantity),
        images: editingProduct.images || []
      };
      
      console.log('Updating product data:', productData);
      
      const response = await fetch(`https://ecommerce-website-iwrz.onrender.com/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Product updated successfully:', result);
        closeEditModal();
        // Refresh the page to get updated product data
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Failed to update product:', errorData);
        alert(`Failed to update product: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCarouselModal(true)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center space-x-2 shadow-lg"
          >
            <span>🎠</span>
            <span>Manage Hero Carousel</span>
          </button>
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          <option value="Makeup">Makeup</option>
          <option value="Skincare">Skincare</option>
          <option value="Haircare">Haircare</option>
          <option value="Fragrance">Fragrance</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-gray-600 text-sm">📦</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name.length > 20 ? `${product.name.substring(0, 20)}...` : product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.countInStock || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    (product.countInStock || 0) > 0 
                      ? 'bg-pink-100 text-pink-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {(product.countInStock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors">
            ←
          </button>
          <button className="px-3 py-2 bg-pink-100 text-pink-800 rounded-lg font-medium">1</button>
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors">2</button>
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors">3</button>
          <span className="px-3 py-2 text-gray-500">...</span>
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors">10</button>
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors">
            →
          </button>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Product</h3>
              <button
                onClick={closeAddModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Makeup">Makeup</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Haircare">Haircare</option>
                    <option value="Fragrance">Fragrance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>

              {/* Image Upload Component */}
              <ImageUpload
                images={newProduct.images}
                onImagesChange={(images) => setNewProduct(prev => ({ ...prev, images }))}
              />

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 border border-transparent rounded-md hover:from-pink-600 hover:to-rose-600 transition-colors shadow-lg"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Product</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleEditProduct(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleEditInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={editingProduct.quantity}
                    onChange={handleEditInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={editingProduct.category}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Makeup">Makeup</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Haircare">Haircare</option>
                    <option value="Fragrance">Fragrance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editingProduct.description}
                  onChange={handleEditInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>

              {/* Image Upload Component */}
              <ImageUpload
                images={editingProduct.images}
                onImagesChange={(images) => setEditingProduct(prev => ({ ...prev, images }))}
              />

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 border border-transparent rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors shadow-lg"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Carousel Management Modal */}
      {showCarouselModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Manage Hero Carousel</h3>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={fetchCarouselSlides}
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-2"
                  title="Refresh slides"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
                <button 
                  onClick={() => setShowCarouselModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This carousel now displays images only (no text or buttons). 
                    Upload GIF images for animated slides. Changes appear on the home page after refreshing.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Slides Display */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Current Slides</h4>
              {carouselSlides.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <span className="text-4xl mb-4 block">🎠</span>
                  <p className="text-gray-600">No slides yet. Add your first slide below!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {carouselSlides.map((slide) => (
                    <div key={slide._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        {slide.imageUrl ? (
                          <img 
                            src={slide.imageUrl} 
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </div>
                                           <div className="space-y-2">
                       <p className="text-sm font-medium text-gray-900">Slide {slide.order + 1}</p>
                       <div className="flex space-x-2">
                         <button 
                           onClick={() => openEditSlideModal(slide)}
                           className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                         >
                           Edit
                         </button>
                         <button 
                           onClick={() => handleDeleteSlide(slide._id)}
                           className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                         >
                           Delete
                         </button>
                       </div>
                     </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Slide Form */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Add New Slide</h4>
              <div className="max-w-md">
                <CarouselImageUpload 
                  imageUrl={newSlide.imageUrl}
                  onImageChange={(url) => setNewSlide(prev => ({ ...prev, imageUrl: url }))}
                  label="Slide Image"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setShowCarouselModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddSlide}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 border border-transparent rounded-md hover:from-rose-600 hover:to-pink-600 transition-colors shadow-lg"
                >
                  Add Slide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Slide Modal */}
      {showCarouselEditModal && editingSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Slide</h3>
              <button 
                onClick={closeEditSlideModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-w-md">
              <CarouselImageUpload 
                imageUrl={editingSlide.imageUrl}
                onImageChange={(url) => setEditingSlide(prev => ({ ...prev, imageUrl: url }))}
                label="Slide Image"
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={closeEditSlideModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditSlide}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 border border-transparent rounded-md hover:from-indigo-600 hover:to-purple-600 transition-colors shadow-lg"
              >
                Update Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Orders Section Component
const OrdersSection = ({ orders }) => {
  // Safety check to ensure orders is an array
  const ordersArray = Array.isArray(orders) ? orders : [];
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage customer orders and track fulfillment</p>
      </div>

      {/* Orders Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
            <span className="text-green-500 text-sm">+8.2%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">{ordersArray.length}</span>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
            <span className="text-yellow-500 text-sm">Processing</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {ordersArray.filter(order => order.status === 'pending').length}
            </span>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Completed</h3>
            <span className="text-green-500 text-sm">Delivered</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {ordersArray.filter(order => order.status === 'completed').length}
            </span>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
            <span className="text-green-500 text-sm">+12.5%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              ${ordersArray.reduce((total, order) => total + (order.totalAmount || 0), 0).toFixed(2)}
            </span>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordersArray.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order._id.slice(-6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customerName || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{order.customerEmail || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.orderItems?.length || 0} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${order.totalAmount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'completed' ? 'bg-pink-100 text-pink-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-gray-900 hover:text-gray-700 transition-colors mr-3">
                    View
                  </button>
                  <button className="text-gray-900 hover:text-gray-700 transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ordersArray.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500">Orders will appear here once customers start placing them.</p>
        </div>
      )}
    </div>
  );
};

// Users Section Component
const UsersSection = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Safety check to ensure users is an array
  const usersArray = Array.isArray(users) ? users : [];

  const filteredUsers = usersArray.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || 
                       (selectedRole === 'admin' && user.isAdmin) ||
                       (selectedRole === 'superadmin' && user.isSuperAdmin) ||
                       (selectedRole === 'user' && !user.isAdmin && !user.isSuperAdmin);
    return matchesSearch && matchesRole;
  });

  const openModifyModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.isSuperAdmin ? 'superadmin' : user.isAdmin ? 'admin' : 'user');
    setShowModifyModal(true);
  };

  const closeModifyModal = () => {
    setShowModifyModal(false);
    setSelectedUser(null);
    setNewRole('');
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      const token = localStorage.getItem('token');
      
      // Convert role string to boolean values
      const isAdmin = newRole === 'admin' || newRole === 'superadmin';
      const isSuperAdmin = newRole === 'superadmin';
      
      const response = await fetch(`https://ecommerce-website-iwrz.onrender.com/api/users/${selectedUser._id}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAdmin, isSuperAdmin })
      });

      if (response.ok) {
        // Refresh the page to get updated user data
        window.location.reload();
      } else {
        console.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Users</option>
          <option value="user">Regular Users</option>
          <option value="admin">Admins</option>
          <option value="superadmin">Super Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modify
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id} className={`hover:bg-gray-50 ${
                user.isSuperAdmin ? 'bg-yellow-50' : ''
              }`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-600 text-sm font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">ID: {user._id.slice(-6)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isSuperAdmin ? 'bg-yellow-100 text-yellow-800' :
                    user.isAdmin ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isSuperAdmin ? 'SuperAdmin' : user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => openModifyModal(user)}
                    className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    Modify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Modify User Modal */}
      {showModifyModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Modify User</h3>
              <button
                onClick={closeModifyModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">{selectedUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Role</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedUser.isSuperAdmin ? 'bg-yellow-100 text-yellow-800' :
                  selectedUser.isAdmin ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedUser.isSuperAdmin ? 'SuperAdmin' : selectedUser.isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedUser.isVerified ? 'bg-pink-100 text-pink-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Change Role To</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">SuperAdmin</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={closeModifyModal}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 border border-transparent rounded-md hover:from-pink-600 hover:to-rose-600 transition-colors shadow-lg"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Section Component
const ProfileSection = ({ user }) => {
  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user.name || ''}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user.email || ''}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              type="text"
              value={user.isSuperAdmin ? 'SuperAdmin' : user.isAdmin ? 'Admin' : 'User'}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>
            <input
              type="text"
              value={user.isVerified ? 'Verified' : 'Unverified'}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Member Since</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">📅</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Last Login</h3>
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">🔐</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today'}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Account Type</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-lg">👤</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {user.isSuperAdmin ? 'SuperAdmin' : user.isAdmin ? 'Admin' : 'Customer'}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-2xl">✏️</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">Edit Profile</div>
              <div className="text-sm text-gray-500">Update your information</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-2xl">🔒</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">Change Password</div>
              <div className="text-sm text-gray-500">Update your security</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-2xl">⚙️</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">Preferences</div>
              <div className="text-sm text-gray-500">Customize your experience</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
