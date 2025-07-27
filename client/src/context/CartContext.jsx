import React, { useEffect, useState } from "react";
import { CartContext } from "./CartContextDef";

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
      // Prevent duplicates by id
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    setCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 