import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import FavoriteButton from "../components/FavoriteButton";
import axios from "axios";

const reviews = [
  {
    name: "Alice Smith",
    rating: 5,
    date: "2 days ago",
    comment: "Absolutely love this product! The quality exceeded my expectations and it's become a staple in my daily routine. Highly recommend!",
    verified: true
  },
  {
    name: "John Doe",
    rating: 5,
    date: "1 week ago",
    comment: "Fast shipping and works perfectly. The texture and finish are exactly what I was looking for. Will definitely repurchase!",
    verified: true
  },
  {
    name: "Sarah Johnson",
    rating: 4,
    date: "2 weeks ago",
    comment: "Great product overall! The packaging is beautiful and the product itself is high quality. Only giving 4 stars because the scent is a bit strong for my preference.",
    verified: true
  },
  {
    name: "Mike Wilson",
    rating: 5,
    date: "3 weeks ago",
    comment: "This is my third time buying this product. It's that good! The results are consistent and the customer service is excellent.",
    verified: true
  }
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Helper function to determine if product is available
  const isProductAvailable = (product) => {
    if (!product) return false;
    // Product is available if it has positive stock quantity
    return (product.countInStock && product.countInStock > 0) || 
           (product.inStock) || 
           (product.stock && product.stock > 0) || 
           (product.quantity && product.quantity > 0);
  };

  // Fetch related products from the same category
  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products?category=${category}`);
      
      // Filter out the current product and limit to 4 related products
      const filtered = response.data
        .filter(product => product._id !== currentProductId)
        .slice(0, 4);
      
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Error fetching related products:', error);
      setRelatedProducts([]);
    }
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        const productData = response.data;
        setProduct(productData);
        
        // Fetch related products from the same category
        if (productData.category) {
          fetchRelatedProducts(productData.category, productData._id);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
        // Fallback to mock data if API fails
        const mockProducts = [
          {
            _id: 1,
            name: "Luxury Matte Lipstick - Velvet Rose",
            price: 29.99,
            originalPrice: 39.99,
            image: "https://source.unsplash.com/600x600/?lipstick,beauty",
            images: [
              "https://source.unsplash.com/600x600/?lipstick,beauty",
              "https://source.unsplash.com/600x600/?makeup,cosmetics",
              "https://source.unsplash.com/600x600/?beauty,product"
            ],
            description: "Experience the ultimate luxury with our Velvet Rose Matte Lipstick. This long-lasting, highly pigmented formula glides on smoothly and stays put for up to 8 hours. Enriched with nourishing ingredients like Vitamin E and Jojoba Oil, it keeps your lips soft and hydrated while delivering intense, vibrant color.",
            category: "Makeup",
            brand: "Mazzinka",
            rating: 4.8,
            reviewCount: 127,
            inStock: true,
            features: [
              "Long-lasting formula (8+ hours)",
              "Highly pigmented",
              "Nourishing ingredients",
              "Matte finish",
              "Cruelty-free",
              "Vegan-friendly"
            ],
            ingredients: "Vitamin E, Jojoba Oil, Shea Butter, Natural Waxes, Organic Pigments",
            howToUse: "Apply directly to clean lips. For best results, exfoliate lips first and use a lip liner for precise application."
          },
          {
            _id: 2,
            name: "Hydrating Face Serum - Golden Glow",
            price: 49.99,
            originalPrice: 59.99,
            image: "https://source.unsplash.com/600x600/?serum,skincare",
            images: [
              "https://source.unsplash.com/600x600/?serum,skincare",
              "https://source.unsplash.com/600x600/?beauty,skin",
              "https://source.unsplash.com/600x600/?cosmetics,care"
            ],
            description: "Transform your skin with our Golden Glow Hydrating Face Serum. This powerful formula combines Hyaluronic Acid, Vitamin C, and Golden Peptides to deeply hydrate, brighten, and firm your skin. Suitable for all skin types, it's the perfect addition to your daily skincare routine.",
            category: "Skincare",
            brand: "Mazzinka",
            rating: 4.9,
            reviewCount: 89,
            inStock: true,
            features: [
              "Deep hydration",
              "Brightening effect",
              "Anti-aging properties",
              "Suitable for all skin types",
              "Fragrance-free",
              "Dermatologist tested"
            ],
            ingredients: "Hyaluronic Acid, Vitamin C, Golden Peptides, Niacinamide, Aloe Vera",
            howToUse: "Apply 2-3 drops to clean, dry skin morning and evening. Follow with moisturizer and sunscreen during the day."
          },
          {
            _id: 3,
            name: "Centella Light Cleansing Oil - 30ml",
            price: 35.00,
            originalPrice: 45.00,
            image: "https://source.unsplash.com/600x600/?cleansing,oil",
            images: [
              "https://source.unsplash.com/600x600/?cleansing,oil",
              "https://source.unsplash.com/600x600/?skincare,product",
              "https://source.unsplash.com/600x600/?beauty,care"
            ],
            description: "SKIN1004 - Madagascar Centella Light Cleansing Oil - a light facial cleansing oil suitable for all skin types. It effectively removes makeup, including eye makeup, and cleanses residual sebum and sunscreen in the first step of cleansing. The product is based on natural ingredients and is gentle on the skin.",
            category: "Skincare",
            brand: "SKIN1004",
            rating: 4.5,
            reviewCount: 89,
            inStock: true,
            features: [
              "Light texture",
              "Suitable for all skin types",
              "Effectively removes makeup",
              "Natural ingredients",
              "Gentle on skin",
              "30ml size"
            ],
            ingredients: "Centella Asiatica Extract, Natural Oils, Vitamin E, Antioxidants",
            howToUse: "Apply to dry skin, massage gently, then rinse with warm water. Use as the first step in your double cleansing routine."
          }
        ];
        const mockProduct = mockProducts.find(p => p._id === Number(id));
        if (mockProduct) {
          setProduct(mockProduct);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);



  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-fuchsia-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading your beauty...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-fuchsia-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Product Not Found</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-fuchsia-100 relative overflow-hidden">
      {/* Creative Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-rose-400/30 to-fuchsia-400/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-fuchsia-400/30 to-pink-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Modern geometric patterns */}
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-pink-400/15 to-rose-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-gradient-to-r from-rose-400/15 to-fuchsia-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Additional vibrant elements */}
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-full animate-bounce" style={{ animationDelay: '5s' }}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/8 to-transparent opacity-40"></div>
      </div>
      
      {/* Simple Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 text-gray-600 hover:text-pink-600 transition-colors duration-300 group "
        >
          <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold text-lg">Back to Products</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Section */}
          <div className="space-y-6">
          
            {/* Main Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 overflow-hidden">
                <img
                  src={product.images?.[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Discount Badge */}
                {product.originalPrice && (
                  <div className="absolute top-6 left-6">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      -{calculateDiscount()}%
                    </div>
                  </div>
                )}

                {/* Favorite Button */}
                <FavoriteButton 
                  product={product}
                  className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg hover:rotate-12"
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative group ${
                      selectedImage === index ? 'ring-2 ring-pink-500' : ''
                    }`}
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg">
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information Section */}
          <div className="space-y-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="hover:text-pink-600 cursor-pointer transition-colors duration-300">Home</span>
              <span>/</span>
              <span className="hover:text-pink-600 cursor-pointer transition-colors duration-300">{product.category}</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </div>

            {/* Product Title & Brand */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mb-2">by <span className="font-semibold text-pink-600">{product.brand}</span></p>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.floor(product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-bold text-gray-800">{product.rating || 4.8}</span>
              <span className="text-gray-600">({product.reviewCount || 127} reviews)</span>
            </div>

            {/* Price Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-5xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">${product.originalPrice}</span>
                    <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              
              {!isProductAvailable(product) && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
                  Out of Stock
                </div>
              )}
            </div>


            {/* Quantity & Add to Cart */}
            <div className="space-y-6">
                             <div className="flex items-center space-x-4">
                 <label className="text-lg font-semibold text-gray-900">Quantity:</label>
                 <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-pink-300 p-2 shadow-lg">
                   <button
                     onClick={() => handleQuantityChange(quantity - 1)}
                     className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center hover:shadow-md shadow-lg"
                     disabled={quantity <= 1}
                   >
                     <span className="text-2xl font-bold text-white">−</span>
                   </button>
                   <span className="w-16 text-center text-xl font-bold text-gray-900 bg-white px-3 py-2 rounded-xl border border-pink-200">{quantity}</span>
                   <button
                     onClick={() => handleQuantityChange(quantity + 1)}
                     className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center hover:shadow-md shadow-lg"
                   >
                     <span className="text-2xl font-bold text-white">+</span>
                   </button>
                 </div>
               </div>

                             <button
                 disabled={!isProductAvailable(product)}
                 className={`w-full py-4 px-8 rounded-2xl font-bold text-xl shadow-xl transform hover:scale-105 transition-all duration-300 ${
                   isProductAvailable(product)
                     ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-2xl'
                     : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed opacity-75'
                 }`}
                 onClick={() => isProductAvailable(product) && addToCart({ ...product, quantity })}
               >
                 {isProductAvailable(product) ? '🛍️ Add to Cart' : 'Out of Stock'}
               </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              {product.ingredients && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ingredients</h4>
                  <p className="text-gray-600 text-sm">{product.ingredients}</p>
                </div>
              )}
              {product.howToUse && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How to Use</h4>
                  <p className="text-gray-600 text-sm">{product.howToUse}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description & Features Section - Full Width */}
        <div className="mt-12 relative z-10">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30">
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg text-left">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-gray-900 mb-4">Customer Reviews</h2>
            <p className="text-xl text-gray-600">See what our customers are saying about this product</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="group">
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                  {/* Review Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    {review.verified && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center space-x-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16 relative z-10">
          {/* Hero Section with Animated Background */}
          <div className="relative overflow-hidden mb-16">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-tr from-purple-200/30 to-rose-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            
            <div className="mb-4 relative text-center">
              <h2 className="py-2 text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-4">
                You Might Also Like
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover more amazing products from our collection, redisgn card to be consistent with our general design, be ultimate, advanced and creative like always
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="group cursor-pointer" onClick={() => navigate(`/products/${relatedProduct._id}`)}>
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500">
                    {/* 3D Card Shadow with Mazzinka Identity Colors */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-3xl blur-2xl group-hover:blur-2xl transition-all duration-500"></div>
                    
                    <div className="relative">
                      {/* Image Container */}
                      <div className="relative overflow-hidden rounded-2xl mb-6 group-hover:rounded-3xl transition-all duration-500 flex-shrink-0">
                        {/* Mazzinka Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-rose-400/20 z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                        
                        <img
                          src={relatedProduct.images?.[0] || relatedProduct.image || "https://via.placeholder.com/400x400"}
                          alt={relatedProduct.name}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Mazzinka Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Stock Badge */}
                        {relatedProduct.countInStock > 0 ? (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            ✨ In Stock
                          </div>
                        ) : (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            🔴 Out of Stock
                          </div>
                        )}
                      </div>
                      
                      {/* Product Information - Flexbox layout for perfect price alignment */}
                      <div className="flex flex-col h-full">
                        {/* Title - centralized with flex-1 */}
                        <div className="flex-1 flex items-center justify-center text-center px-2 mb-6">
                          <h3 className="font-bold text-xl text-gray-900 group-hover:text-pink-600 transition-colors duration-300 leading-tight line-clamp-2">
                            {relatedProduct.name}
                          </h3>
                        </div>

                        {/* Price - always just above button */}
                        <div className="text-center mb-4">
                          <span className="text-3xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                            ${relatedProduct.price}
                          </span>
                        </div>

                        {/* Review Stars & Grade */}
                        <div className="text-center mb-6">
                          {/* Star Rating */}
                          <div className="flex items-center justify-center space-x-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.floor(relatedProduct.rating || 4) ? 'text-yellow-400' : 'text-gray-300'
                                } transition-all duration-300 group-hover:scale-110`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          
                          {/* Grade & Review Count */}
                          <div className="flex items-center justify-center space-x-3">
                            <span className="text-lg font-bold text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                              {relatedProduct.rating || 4.8}
                            </span>
                            <span className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                              ({relatedProduct.numReviews || relatedProduct.reviewCount || 127} reviews)
                            </span>
                          </div>
                        </div>

                        {/* Button - always sticks to bottom */}
                        <div className="mt-auto">
                          <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl transform group-hover:scale-105 transition-all duration-500 whitespace-nowrap text-center">
                            Discover
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback when no related products
              <div className="col-span-full text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/30">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Related Products Yet</h3>
                  <p className="text-gray-600">We're working on adding more amazing products in this category!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 