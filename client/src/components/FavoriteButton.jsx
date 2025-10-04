import React, { useState, useEffect } from 'react';

const FavoriteButton = ({ product, className = "" }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if product is in favorites
  useEffect(() => {
    if (product) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some(fav => fav._id === product._id));
    }
  }, [product]);

  // Toggle favorite status
  const toggleFavorite = (e) => {
    e.preventDefault(); // Prevent navigation if button is inside a Link
    e.stopPropagation(); // Prevent event bubbling
    
    if (!product) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(fav => fav._id !== product._id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      // Add to favorites
      const productToAdd = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0],
        category: product.category,
        brand: product.brand
      };
      favorites.push(productToAdd);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
    
    // Dispatch custom event to update navbar count
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  return (
    <button 
      onClick={toggleFavorite}
      className={`transition-all duration-300 transform hover:scale-110 ${
        isFavorite 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-600 hover:text-purple-600'
      } ${className}`}
    >
      <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
};

export default FavoriteButton;
