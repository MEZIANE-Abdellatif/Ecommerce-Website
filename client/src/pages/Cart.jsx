import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  // Calculate total price
  const total = cart.reduce((sum, item) => {
    // Remove $ and parse as float
    const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <p className="text-center text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Link to="/products" className="text-blue-600 hover:underline text-base">Go back to Products</Link>
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white rounded-lg shadow p-4 justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-24 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-700">{item.price}</p>
                </div>
              </div>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-8">
            <span className="text-lg font-bold text-gray-800">Total: ${total.toFixed(2)}</span>
            <Link
              to="/checkout"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors ml-4"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 