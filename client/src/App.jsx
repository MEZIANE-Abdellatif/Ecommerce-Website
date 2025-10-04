import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterConfirmation from "./pages/RegisterConfirmation";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import PaymentMethod from "./pages/PaymentMethod";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Makeup from "./pages/Makeup";
import Skincare from "./pages/Skincare";
import Haircare from "./pages/Haircare";
import Fragrance from "./pages/Fragrance";
import NewArrivals from "./pages/NewArrivals";
import Favorites from "./pages/Favorites";
import BestSellers from "./pages/BestSellers";
import DiscountProducts from "./pages/DiscountProducts";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import './App.css'

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-confirmation" element={<RegisterConfirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/payment-method" element={<PaymentMethod />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Category Pages */}
        <Route path="/makeup" element={<Makeup />} />
        <Route path="/skincare" element={<Skincare />} />
        <Route path="/haircare" element={<Haircare />} />
        <Route path="/fragrance" element={<Fragrance />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/best-sellers" element={<BestSellers />} />
        <Route path="/discounts" element={<DiscountProducts />} />
        
        {/* User Pages */}
        <Route path="/favorites" element={<Favorites />} />

      </Routes>
      </Router>
    </CartProvider>
  );
}

export default App
