import React from "react";
import { useNavigate } from "react-router-dom";
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

export default function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{product.name}</h3>
              <p className="text-gray-700 mb-1">{product.price}</p>
              <p className="text-gray-500 text-sm mb-4 flex-1">{product.description}</p>
              <button
                className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                onClick={e => { e.stopPropagation(); addToCart(product); }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 