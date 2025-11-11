const express = require('express');
const rateLimit = require('express-rate-limit');
const { searchGeocoding, getPlaceDetails } = require('../services/geocodingService');

const router = express.Router();

// Rate limiter: 5 requests per second per IP
const geocodeLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // 5 requests per second
  message: 'Too many geocoding requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * GET /api/geocode/search
 * Search for addresses using Google Places API
 * Query params: q (query), type (street|city|postcode|country), country (ISO2), lang
 */
router.get('/search', geocodeLimiter, async (req, res) => {
  try {
    const { q, type, country, lang } = req.query;

    // Validate query
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    // Use defaults from env if not provided
    const searchCountry = country || process.env.DEFAULT_COUNTRY || 'pl';
    const searchLang = lang || process.env.DEFAULT_LANG || 'en';

    // Fetch results from geocoding service
    const results = await searchGeocoding(q.trim(), type, searchCountry, searchLang);

    res.json(results);
  } catch (error) {
    console.error('Error in geocode search:', error);
    res.json([]);
  }
});

/**
 * GET /api/geocode/details
 * Get structured address details from place_id
 * Query params: place_id, lang
 */
router.get('/details', geocodeLimiter, async (req, res) => {
  try {
    const { place_id, lang } = req.query;

    // Validate place_id
    if (!place_id || place_id.trim().length === 0) {
      return res.status(400).json({ error: 'place_id is required' });
    }

    const searchLang = lang || process.env.DEFAULT_LANG || 'en';

    // Fetch place details from geocoding service
    const placeDetails = await getPlaceDetails(place_id, searchLang);

    if (!placeDetails) {
      return res.status(404).json({ error: 'Place not found' });
    }

    res.json(placeDetails);
  } catch (error) {
    console.error('Error in geocode details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


