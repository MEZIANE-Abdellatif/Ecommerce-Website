import React from "react";

export default function Success() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-green-100 rounded-full p-6 mb-6">
        <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-green-700 mb-2 text-center">Thank you for your order!</h2>
      <p className="text-gray-700 text-lg text-center">Your order has been placed successfully.</p>
    </div>
  );
} 