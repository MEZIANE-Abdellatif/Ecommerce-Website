import { useContext } from "react";
import { CartContext } from "../context/CartContextDef";
 
export function useCart() {
  return useContext(CartContext);
} 