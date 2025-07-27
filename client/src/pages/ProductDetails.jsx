import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$59.99",
    image: "https://source.unsplash.com/300x200/?headphones,gadget",
    description: "High-quality wireless headphones with noise cancellation.",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "$99.99",
    image: "https://source.unsplash.com/300x200/?watch,smart",
    description: "Track your fitness and notifications with this smart watch.",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: "$79.99",
    image: "https://source.unsplash.com/300x200/?shoes,running",
    description: "Comfortable running shoes for all terrains.",
  },
  {
    id: 4,
    name: "Backpack",
    price: "$39.99",
    image: "https://source.unsplash.com/300x200/?backpack,bag",
    description: "Durable backpack with multiple compartments.",
  },
  {
    id: 5,
    name: "Sunglasses",
    price: "$19.99",
    image: "https://source.unsplash.com/300x200/?sunglasses,accessory",
    description: "Stylish sunglasses with UV protection.",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: "$49.99",
    image: "https://source.unsplash.com/300x200/?speaker,bluetooth",
    description: "Portable Bluetooth speaker with deep bass.",
  },
];

const reviews = [
  {
    name: "Alice Smith",
    rating: 5,
    comment: "Great product! Exceeded my expectations and the quality is top-notch.",
  },
  {
    name: "John Doe",
    rating: 5,
    comment: "Fast shipping and works perfectly. Highly recommend!",
  },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Product Not Found</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/products')}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full p-6 mx-auto mb-8">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover rounded mb-4"
        />
        <h2 className="text-2xl font-bold mb-2 text-gray-900">{product.name}</h2>
        <p className="text-gray-700 mb-2">{product.price}</p>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full mb-2"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
        <button
          className="w-full text-blue-600 hover:underline"
          onClick={() => navigate('/products')}
        >
          Back to Products
        </button>
      </div>
      {/* Customer Reviews Section */}
      <div className="bg-white rounded-lg shadow max-w-md w-full p-6 mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Customer Reviews</h3>
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <div key={idx} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-700">{review.name}</span>
                <span className="flex text-yellow-400 text-sm">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/></svg>
                  ))}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 