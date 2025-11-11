/**
 * Extract structured address parts from a Google Places suggestion
 * @param {Object} suggestion - Google Places API response object
 * @returns {Object} - Structured address parts
 */
export function deriveAddressParts(suggestion) {
  if (!suggestion) {
    return {
      streetLine: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      countryCode: '',
      lat: null,
      lon: null
    };
  }

  // Google Places Autocomplete only provides display_name (description)
  // No structured address data is available without additional API calls
  const displayName = suggestion.display_name || '';

  // For Google Places, we can only extract basic info from the display name
  // The user will need to type each field manually (Option A)
  return {
    streetLine: displayName,
    city: '',
    state: '',
    postcode: '',
    country: '',
    countryCode: '',
    lat: suggestion.lat || null,
    lon: suggestion.lon || null
  };
}

/**
 * Format postal code based on country
 * @param {string} value - Raw postal code value
 * @param {string} country - ISO2 country code
 * @returns {string} - Formatted postal code
 */
export function formatPostalCode(value, country) {
  if (!value) return '';

  const cleaned = value.replace(/[^0-9]/g, '');

  if (country === 'PL') {
    // Polish format: NN-NNN
    if (cleaned.length >= 5) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}`;
    }
    return cleaned;
  }

  if (country === 'MA') {
    // Moroccan format: NNNNN (5 digits)
    return cleaned.slice(0, 5);
  }

  return value;
}

/**
 * Validate postal code format based on country
 * @param {string} value - Postal code value
 * @param {string} country - ISO2 country code
 * @returns {Object} - { valid: boolean, message: string }
 */
export function validatePostalCode(value, country) {
  if (!value) {
    return { valid: true, message: '' };
  }

  if (country === 'PL') {
    const plRegex = /^\d{2}-\d{3}$/;
    if (!plRegex.test(value)) {
      return { 
        valid: false, 
        message: 'Polish postal code should be in format: NN-NNN (e.g., 00-950)' 
      };
    }
  }

  if (country === 'MA') {
    const maRegex = /^\d{5}$/;
    if (!maRegex.test(value)) {
      return { 
        valid: false, 
        message: 'Moroccan postal code should be 5 digits (e.g., 20000)' 
      };
    }
  }

  return { valid: true, message: '' };
}

/**
 * Get recent picks from localStorage
 * @param {string} queryType - Type of query (street, city, etc.)
 * @param {string} country - ISO2 country code
 * @returns {Array} - Array of recent picks
 */
export function getRecentPicks(queryType, country) {
  try {
    const key = `autocomplete_recent_${queryType}_${country}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading recent picks:', error);
    return [];
  }
}

/**
 * Save a pick to recent picks in localStorage
 * @param {string} queryType - Type of query
 * @param {string} country - ISO2 country code
 * @param {Object} pick - The picked suggestion
 */
export function saveRecentPick(queryType, country, pick) {
  try {
    const key = `autocomplete_recent_${queryType}_${country}`;
    const recent = getRecentPicks(queryType, country);
    
    // Add new pick to the beginning, remove duplicates based on display_name
    const filtered = recent.filter(item => item.display_name !== pick.display_name);
    const updated = [pick, ...filtered].slice(0, 10); // Keep max 10
    
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent pick:', error);
  }
}

/**
 * Parse Google Places Details API response into structured address
 * @param {Object} placeDetails - Google Places Details response
 * @returns {Object} - { street, city, postalCode, state, country, countryCode, lat, lon }
 */
export function parsePlaceDetails(placeDetails) {
  if (!placeDetails || !placeDetails.address_components) {
    return {
      street: '',
      city: '',
      postalCode: '',
      state: '',
      country: '',
      countryCode: '',
      lat: null,
      lon: null
    };
  }

  const components = placeDetails.address_components;
  const result = {
    street: '',
    city: '',
    postalCode: '',
    state: '',
    country: '',
    countryCode: '',
    lat: placeDetails.geometry?.location?.lat || null,
    lon: placeDetails.geometry?.location?.lng || null
  };

  // Extract address components
  components.forEach(component => {
    const types = component.types;

    // Street number
    if (types.includes('street_number')) {
      result.street = component.long_name + (result.street ? ' ' + result.street : '');
    }

    // Route (street name)
    if (types.includes('route')) {
      result.street = (result.street ? result.street + ' ' : '') + component.long_name;
    }

    // Locality (city) - try multiple types as Google uses different ones
    if (types.includes('locality')) {
      result.city = component.long_name;
    } else if (!result.city && types.includes('administrative_area_level_2')) {
      // Sometimes city is in administrative_area_level_2
      result.city = component.long_name;
    } else if (!result.city && types.includes('sublocality_level_1')) {
      // Sometimes city is in sublocality
      result.city = component.long_name;
    }

    // Postal code
    if (types.includes('postal_code')) {
      result.postalCode = component.long_name;
    }

    // Administrative area level 1 (state/province)
    if (types.includes('administrative_area_level_1')) {
      result.state = component.long_name;
    }

    // Country
    if (types.includes('country')) {
      result.country = component.long_name;
      result.countryCode = component.short_name;
    }
  });

  return result;
}


