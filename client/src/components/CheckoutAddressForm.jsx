import React, { useState, useEffect } from 'react';
import AutocompleteField from './AutocompleteField';
import AddressSearchField from './AddressSearchField';
import { formatPostalCode, validatePostalCode, parsePlaceDetails } from '../utils/addressUtils';
import { API_ENDPOINTS } from '../config/api';

/**
 * Checkout address form with searchable autocomplete fields
 */
export default function CheckoutAddressForm({ formData, setFormData, user }) {
  const [postalValidation, setPostalValidation] = useState({ valid: true, message: '' });
  const countryCode = 'PL'; // Fixed to Poland

  // Update postal validation when postal code changes
  useEffect(() => {
    const validation = validatePostalCode(formData.postalCode, countryCode);
    setPostalValidation(validation);
  }, [formData.postalCode]);

  // Handle regular input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-format postal code
    if (name === 'postalCode') {
      const formatted = formatPostalCode(value, countryCode);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  // Handle city pick
  const handleCityPick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      city: suggestion.display_name,
      // Clear dependent fields when city changes
      address: '',
      postalCode: '',
      state: '',
      lat: suggestion.lat,
      lon: suggestion.lon
    }));
  };

  // Handle street pick
  const handleStreetPick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      address: suggestion.display_name,
      // Clear dependent fields when street changes
      postalCode: '',
      state: '',
      lat: suggestion.lat,
      lon: suggestion.lon
    }));
  };

  // Handle postal code pick
  const handlePostalPick = (suggestion) => {
    const displayName = suggestion.display_name || '';
    let postalCode = displayName.split(',')[0].trim();
    const formatted = formatPostalCode(postalCode, countryCode);
    
    setFormData(prev => ({
      ...prev,
      postalCode: formatted,
      lat: suggestion.lat,
      lon: suggestion.lon
    }));
  };

  // Handle state pick
  const handleStatePick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      state: suggestion.display_name,
      lat: suggestion.lat,
      lon: suggestion.lon
    }));
  };

  // Handle primary address selection
  const handleAddressSelect = async (placeId) => {
    try {
      // Fetch place details from backend
      const response = await fetch(`${API_ENDPOINTS.GEOCODE_DETAILS}?place_id=${placeId}&lang=en`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to fetch place details:', response.status, errorText);
        return;
      }

      const placeDetails = await response.json();

      // Parse structured address
      const parsed = parsePlaceDetails(placeDetails);
      
      // Format postal code if needed (always PL format)
      const formattedPostalCode = parsed.postalCode 
        ? formatPostalCode(parsed.postalCode, 'PL')
        : '';
      
      // When user selects a complete address, update ALL address fields with parsed data
      // Use parsed values if they are non-empty, otherwise keep previous values
      setFormData(prev => ({
        ...prev,
        address: parsed.street && parsed.street.trim() !== '' ? parsed.street : prev.address,
        city: parsed.city && parsed.city.trim() !== '' ? parsed.city : prev.city,
        postalCode: formattedPostalCode && formattedPostalCode.trim() !== '' ? formattedPostalCode : prev.postalCode,
        state: parsed.state && parsed.state.trim() !== '' ? parsed.state : prev.state,
        lat: parsed.lat !== null && parsed.lat !== undefined ? parsed.lat : prev.lat,
        lon: parsed.lon !== null && parsed.lon !== undefined ? parsed.lon : prev.lon
      }));
    } catch (error) {
      console.error('❌ Error fetching place details:', error);
    }
  };

  return (
    <>
      {/* Email and Full Name - Regular inputs */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400"
              placeholder="your.email@example.com"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400"
              placeholder="Your full name"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Primary Address Search Field */}
      <AddressSearchField
        onAddressSelect={handleAddressSelect}
        country="PL"
      />

      {/* City - Autocomplete */}
      <AutocompleteField
        label="City"
        placeholder="Start typing your city..."
        value={formData.city}
        onChange={(e) => handleChange({ target: { name: 'city', value: e.target.value } })}
        onPick={handleCityPick}
        queryType="city"
        country={countryCode}
        required
      />

      {/* Street Address - Autocomplete */}
      <AutocompleteField
        label="Street Address"
        placeholder="Start typing your street address..."
        value={formData.address}
        onChange={(e) => handleChange({ target: { name: 'address', value: e.target.value } })}
        onPick={handleStreetPick}
        queryType="street"
        country={countryCode}
        required
      />

      <div className="grid md:grid-cols-2 gap-4">
        {/* Postal Code - Autocomplete */}
        <div>
          <AutocompleteField
            label="Postal Code"
            placeholder="Postal/ZIP code"
            value={formData.postalCode}
            onChange={(e) => handleChange({ target: { name: 'postalCode', value: e.target.value } })}
            onPick={handlePostalPick}
            queryType="postcode"
            country={countryCode}
            disabled={!formData.address}
            required
          />
          {!postalValidation.valid && (
            <p className="mt-1 text-xs text-red-600">{postalValidation.message}</p>
          )}
        </div>

        {/* State/Province - Autocomplete */}
        <AutocompleteField
          label="State/Province"
          placeholder="State or Province"
          value={formData.state}
          onChange={(e) => handleChange({ target: { name: 'state', value: e.target.value } })}
          onPick={handleStatePick}
          queryType="city"
          country={countryCode}
          disabled={!formData.city}
          required
        />
      </div>

      {/* Shipping Method - Keep existing radio buttons */}
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-pink-600 transition-colors">
          Shipping Method
        </label>
        <div className="space-y-3">
          <label className="flex items-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border-2 border-gray-200 hover:border-pink-300 transition-all duration-300 cursor-pointer group/shipping">
            <input
              type="radio"
              name="shippingMethod"
              value="standard"
              checked={formData.shippingMethod === "standard"}
              onChange={handleChange}
              className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Standard Delivery</span>
                <span className="text-pink-600 font-bold">Free</span>
              </div>
              <p className="text-sm text-gray-600">3-5 business days</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover/shipping:opacity-100 transition-opacity duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </label>
          
          <label className="flex items-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border-2 border-gray-200 hover:border-pink-300 transition-all duration-300 cursor-pointer group/shipping">
            <input
              type="radio"
              name="shippingMethod"
              value="express"
              checked={formData.shippingMethod === "express"}
              onChange={handleChange}
              className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Express Delivery</span>
                <span className="text-pink-600 font-bold">$9.99</span>
              </div>
              <p className="text-sm text-gray-600">1-2 business days</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover/shipping:opacity-100 transition-opacity duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </label>
        </div>
      </div>
    </>
  );
}


