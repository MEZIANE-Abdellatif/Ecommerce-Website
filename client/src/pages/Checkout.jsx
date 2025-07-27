import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, setCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    shipping: "standard",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCart([]);
    localStorage.removeItem("cart");
    setSubmitted(true);
    setTimeout(() => navigate("/success"), 1500);
  };

  // Calculate total price
  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  if (submitted) {
    return null; // Redirect handled after short delay
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Checkout Form */}
        <form
          className="bg-white p-8 rounded shadow max-w-md mx-auto w-full flex-1"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Checkout</h2>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-700 font-semibold">Shipping Method</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={form.shipping === "standard"}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Standard (3–5 days)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={form.shipping === "express"}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Express (1–2 days)
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Place Order
          </button>
        </form>
        {/* Order Summary */}
        <div className="bg-white p-8 rounded shadow max-w-md w-full flex-1 h-fit">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h3>
          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <div>
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-gray-500 text-sm">Qty: 1</div>
                  </div>
                  <div className="text-gray-700">{item.price}</div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t mt-4">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-gray-800">${total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 