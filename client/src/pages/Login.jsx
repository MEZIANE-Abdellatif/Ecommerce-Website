import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleLoginButton from "../components/GoogleLogin";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    setNeedsVerification(false);
    try {
      const response = await axios.post("https://ecommerce-website-iwrz.onrender.com/api/users/login", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/profile");
    } catch (error) {
      if (error.response?.data?.needsVerification) {
        setNeedsVerification(true);
        setError(error.response?.data?.message || "Please verify your email before logging in.");
      } else {
        setError(
          error.response?.data?.message ||
          "Login failed. Please try again."
        );
        setNeedsVerification(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError("Please enter your email address first");
      return;
    }

    setResendLoading(true);
    setResendSuccess("");
    setError("");

    try {
      await axios.post("https://ecommerce-website-iwrz.onrender.com/api/users/resend-verification", {
        email: formData.email
      });
      setResendSuccess("Verification email sent successfully! Please check your inbox.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend verification email. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-rose-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-60 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-r from-purple-300/20 to-rose-300/20 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-rose-300/20 to-pink-300/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-2.5">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            {/* Left Side - Visual Content */}
            <div className="hidden lg:block">
              <div className="text-center lg:text-left">
                {/* Logo & Welcome Section */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-2xl mb-4 animate-pulse">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-3">
                    Welcome Back
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Sign in to your MaZzinka account and continue your beauty journey
                  </p>
                  
                  {/* Feature Highlights */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm">Access your beauty collection</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm">Track orders and wishlist</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm">Get exclusive offers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-2xl mb-3 animate-pulse">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-2">
                  Welcome Back
                </h1>
                <p className="text-base text-gray-600 leading-relaxed">
                  Sign in to your MaZzinka account
                </p>
              </div>

              {/* Main Login Card */}
              <div className="relative">
                {/* 3D Card Shadow */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-3xl blur-2xl transform rotate-1"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/90 backdrop-blur-xl rounded-xl p-5 shadow-2xl border border-white/30">
                  {/* Error Messages */}
                  {needsVerification && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-xl">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-bold text-yellow-800">Email Verification Required</h3>
                          <p className="text-sm text-yellow-700 mt-1">Please check your inbox for a verification link.</p>
                          <button
                            onClick={handleResendVerification}
                            disabled={resendLoading}
                            className="mt-3 text-sm bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-amber-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
                          >
                            {resendLoading ? "Sending..." : "Resend Verification Email"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {resendSuccess && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-xl">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l-2-2z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium text-green-800">{resendSuccess}</p>
                      </div>
                    </div>
                  )}

                  {error && !needsVerification && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-400 rounded-xl">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium text-red-800">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Email Field */}
                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-pink-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                          className={`w-full pl-12 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500/20 ${
                            focusedField === 'email' 
                              ? 'border-pink-500 shadow-lg shadow-pink-500/20' 
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                      <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-pink-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField('')}
                          className={`w-full pl-12 pr-12 py-2.5 bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500/20 ${
                            focusedField === 'password' 
                              ? 'border-pink-500 shadow-lg shadow-pink-500/20' 
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-pink-500 transition-colors duration-300"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full py-3 px-5 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white font-bold text-base rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                    >
                      {/* Button Background Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Button Content */}
                      <div className="relative flex items-center justify-center">
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing In...
                          </>
                        ) : (
                          <>
                            Sign In
                            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </div>
                      
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="my-6 flex items-center">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <span className="px-4 text-gray-500 font-medium bg-white/80 backdrop-blur-sm rounded-full">or</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>

                  {/* Google Login */}
                  <div className="mb-6">
                    <GoogleLoginButton onError={handleGoogleError} />
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Don't have an account yet?</p>
                    <Link 
                      to="/register" 
                      className="inline-flex items-center text-pink-600 hover:text-purple-600 font-bold transition-colors duration-300 group"
                    >
                      Create your Mazzinka account
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-pink-600 hover:text-purple-600 font-medium transition-colors duration-300">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-pink-600 hover:text-purple-600 font-medium transition-colors duration-300">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(-10px) rotate(240deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}