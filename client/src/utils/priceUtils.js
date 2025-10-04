/**
 * Parse price value to number, handling both string and number formats
 * @param {string|number} price - The price value (can be string like "$29.99" or number like 29.99)
 * @returns {number} - The parsed price as a number
 */
export const parsePrice = (price) => {
  if (typeof price === 'string') {
    // If price is a string (like "$29.99"), extract the number
    return parseFloat(price.replace(/[^\d.]/g, ""));
  } else {
    // If price is already a number, use it directly
    return parseFloat(price);
  }
};

/**
 * Format price for display
 * @param {string|number} price - The price value
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
  const parsedPrice = parsePrice(price);
  return `$${parsedPrice.toFixed(2)}`;
}; 