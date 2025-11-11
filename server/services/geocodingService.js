const https = require('https');
require('dotenv').config();

// In-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

// Clean up expired cache entries every 30 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (value.expiry < now) {
      cache.delete(key);
    }
  }
}, 30000);

/**
 * Map our query types to Google Places types
 * @param {string} type - Our query type
 * @returns {string} - Google Places type
 */
function getGoogleTypes(type) {
  const typeMap = {
    street: 'address',
    city: '(cities)',
    postcode: 'postal_code',
    country: 'country'  // Changed from '(regions)' to 'country'
  };
  return typeMap[type] || '';
}

/**
 * Fetch geocoding results from Google Places Autocomplete API
 * @param {string} query - Search query
 * @param {string} type - Query type (street, city, postcode, country)
 * @param {string} country - ISO2 country code
 * @param {string} lang - Language code
 * @returns {Promise<Array>} - Array of geocoding results
 */
async function searchGeocoding(query, type, country, lang = 'en') {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error('Google Places API key not found');
    return [];
  }
  

  // Build Google Places API URL
  const params = new URLSearchParams({
    input: query.trim(),
    key: apiKey,
    language: lang || 'en',
    types: getGoogleTypes(type)
  });

  if (country) {
    params.append('components', `country:${country.toLowerCase()}`);
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`;
  

  // Check cache first
  const cached = cache.get(url);
  if (cached && cached.expiry > Date.now()) {
    console.log('Cache hit for:', url);
    return cached.data;
  }

  // Make API request
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.status !== 'OK' && response.status !== 'ZERO_RESULTS') {
            console.error('Google Places API error:', response.status, response.error_message);
            if (response.status === 'REQUEST_DENIED') {
              console.error('API key may have referer restrictions. Please check Google Cloud Console settings.');
            }
            resolve([]);
            return;
          }

          // Transform Google response to match Nominatim format
          const results = response.predictions ? response.predictions.map(prediction => ({
            place_id: prediction.place_id,
            display_name: prediction.description,
            // Google Autocomplete doesn't provide structured address data
            address: {},
            lat: null,
            lon: null
          })) : [];

          // Cache the results
          cache.set(url, {
            data: results,
            expiry: Date.now() + CACHE_TTL
          });

          console.log(`Google Places API returned ${results.length} results for: ${query}`);
          resolve(results);
        } catch (error) {
          console.error('Error parsing Google Places response:', error);
          resolve([]);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching from Google Places:', error);
      resolve([]);
    });
  });
}

/**
 * Fetch place details from Google Places Details API
 * @param {string} placeId - Google Places place_id
 * @param {string} lang - Language code
 * @returns {Promise<Object>} - Structured address data
 */
async function getPlaceDetails(placeId, lang = 'en') {
  if (!placeId) {
    return null;
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error('Google Places API key not found');
    return null;
  }

  // Build Google Places Details API URL
  const params = new URLSearchParams({
    place_id: placeId,
    key: apiKey,
    language: lang || 'en',
    fields: 'address_components,formatted_address,geometry'
  });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;

  // Check cache first
  const cached = cache.get(url);
  if (cached && cached.expiry > Date.now()) {
    console.log('Cache hit for place details:', placeId);
    return cached.data;
  }

  // Make API request
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.status !== 'OK') {
            console.error('Google Places Details API error:', response.status, response.error_message);
            resolve(null);
            return;
          }

          const result = response.result;
          
          // Cache the result
          cache.set(url, {
            data: result,
            expiry: Date.now() + CACHE_TTL
          });

          console.log(`Google Places Details API returned data for place_id: ${placeId}`);
          resolve(result);
        } catch (error) {
          console.error('Error parsing Google Places Details response:', error);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching from Google Places Details:', error);
      resolve(null);
    });
  });
}

module.exports = {
  searchGeocoding,
  getPlaceDetails
};


