import React, { useEffect, useState } from "react";
import { CartContext } from "./CartContextDef";
import { parsePrice } from "../utils/priceUtils";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const productId = product._id || product.id;
      const existingItem = prev.find((item) => (item._id || item.id) === productId);
      if (existingItem) {
        // If item exists, increase quantity
        return prev.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      // If item doesn't exist, add with the quantity from the product or default to 1
      const cartItem = {
        ...product,
        id: productId, // Ensure we have both id and _id for compatibility
        _id: productId,
        image: product.images?.[0] || product.image || "https://via.placeholder.com/300x200",
        quantity: product.quantity || 1
      };
      return [...prev, cartItem];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        (item._id || item.id) === id ? { ...item, quantity } : item
      )
    );
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        (item._id || item.id) === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        if ((item._id || item.id) === id) {
          const newQuantity = (item.quantity || 1) - 1;
          return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parsePrice(item.price);
      const quantity = item.quantity || 1;
      return total + (isNaN(price) ? 0 : price * quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    setCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 