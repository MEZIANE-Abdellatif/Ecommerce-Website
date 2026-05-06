import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import './App.css'

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Success = lazy(() => import("./pages/Success"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const RegisterConfirmation = lazy(() => import("./pages/RegisterConfirmation"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const PaymentMethod = lazy(() => import("./pages/PaymentMethod"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Makeup = lazy(() => import("./pages/Makeup"));
const Skincare = lazy(() => import("./pages/Skincare"));
const Haircare = lazy(() => import("./pages/Haircare"));
const Fragrance = lazy(() => import("./pages/Fragrance"));
const NewArrivals = lazy(() => import("./pages/NewArrivals"));
const Favorites = lazy(() => import("./pages/Favorites"));
const BestSellers = lazy(() => import("./pages/BestSellers"));
const DiscountProducts = lazy(() => import("./pages/DiscountProducts"));

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Suspense fallback={<div className="p-6 text-center text-gray-600">Loading page...</div>}>
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
        </Suspense>
      </Router>
    </CartProvider>
  );
}

export default App
