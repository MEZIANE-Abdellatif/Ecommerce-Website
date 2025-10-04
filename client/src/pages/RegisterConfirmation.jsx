import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RegisterConfirmation() {
  const [countdown, setCountdown] = useState(5);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => setIsAnimating(true), 100);
    
    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-300/20 to-rose-300/20 rounded-full animate-float delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-rose-300/20 to-pink-300/20 rounded-full animate-float delay-2000"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-r from-pink-400/10 to-rose-400/10 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-r from-rose-400/10 to-purple-400/10 rotate-12 animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4">
        <div className="text-center mb-6">
          {/* Success Icon with Animation */}
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full shadow-xl mb-4 transition-all duration-1000 transform ${
            isAnimating ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <svg
              className="w-8 h-8 text-white animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Main Heading */}
          <h1 className={`text-2xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent mb-3 transition-all duration-1000 delay-300 ${
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Welcome to MaZzinka! 🎉
          </h1>
          
          <p className={`text-base text-gray-600 mb-4 transition-all duration-1000 delay-500 ${
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Your account has been created successfully!
          </p>
        </div>

        {/* Main Card */}
        <div className={`relative transition-all duration-1000 delay-700 ${
          isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* 3D Card Shadow */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-3xl blur-2xl transform rotate-1"></div>
          
          {/* Main Card */}
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30">
            {/* Simple Email Verification Instruction */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl p-4 border border-pink-200">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <h2 className="text-lg font-bold text-gray-800">Verify Your Email</h2>
                </div>
                <p className="text-gray-600 text-sm">
                  We've sent a verification link to your email address. Please check your inbox and spam folder, then click the link to activate your account.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mb-4">
              <Link
                to="/login"
                className="group relative w-full py-3 px-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden"
              >
                {/* Button Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button Content */}
                <div className="relative flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Go to Login</span>
                </div>
              </Link>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Didn't receive the email? Check your spam folder or{" "}
                <Link 
                  to="/login" 
                  className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
                >
                  try logging in
                </Link>{" "}
                to resend.
              </p>
            </div>

            {/* Countdown Timer */}
            {countdown > 0 && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 px-3 py-2 bg-pink-50 rounded-full">
                  <svg className="w-3 h-3 text-pink-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-pink-600 font-medium text-xs">
                    Redirecting in {countdown}s...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 