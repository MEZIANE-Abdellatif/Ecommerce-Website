import React, { useState, useEffect, useRef, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';

/**
 * Primary address search field for complete address autocomplete
 * Searches for full addresses and returns place_id on selection
 */
export default function AddressSearchField({
  onAddressSelect,
  country = 'PL',
  lang = 'en',
  disabled = false,
  className = ''
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [value, setValue] = useState('');

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const wrapperRef = useRef(null);
  const justSelectedRef = useRef(false);
  const debounceTimerRef = useRef(null);
  const abortRef = useRef(null);

  // Fetch suggestions from backend
  const fetchSuggestions = useCallback(async (query) => {
    if (justSelectedRef.current) {
      return;
    }

    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const newController = new AbortController();
    abortRef.current = newController;
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        type: 'street',
        lang: lang
      });

      if (country && country.trim() !== '') {
        params.append('country', country);
      }

      const response = await fetch(`${API_ENDPOINTS.GEOCODE_SEARCH}?${params.toString()}`, {
        signal: newController.signal
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();

      if (!newController.signal.aborted && !justSelectedRef.current) {
        setSuggestions(data);
        setIsOpen(data.length > 0);
      }
    } catch (error) {
      if (error.name !== 'AbortError' && !newController.signal.aborted) {
        console.error('Error fetching address suggestions:', error);
        if (!justSelectedRef.current) {
          setSuggestions([]);
          setIsOpen(false);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [country, lang]);

  // Debounce input changes
  useEffect(() => {
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const timer = setTimeout(() => {
      debounceTimerRef.current = null;
      fetchSuggestions(value);
    }, 250);

    debounceTimerRef.current = timer;

    return () => {
      clearTimeout(timer);
    };
  }, [value, fetchSuggestions]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      abortRef.current?.abort();
    };
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setHighlightedIndex(-1);
    justSelectedRef.current = false;
  };

  // Handle suggestion selection
  const handleSelect = (suggestion) => {
    justSelectedRef.current = true;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setSuggestions([]);
    setIsOpen(false);
    setHighlightedIndex(-1);

    setValue(suggestion.display_name);

    if (onAddressSelect && suggestion.place_id) {
      onAddressSelect(suggestion.place_id);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={`group ${className}`} ref={wrapperRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
        Address <span className="text-xs text-gray-500">(Search for complete address)</span>
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 && !justSelectedRef.current) {
              setIsOpen(true);
            }
          }}
          disabled={disabled}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Start typing your complete address (e.g., 123 Main St, Warsaw, Poland)..."
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />

        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="animate-spin h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {isOpen && suggestions.length > 0 && (
          <div
            ref={listRef}
            className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.place_id}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  highlightedIndex === index
                    ? 'bg-pink-50 text-pink-900'
                    : 'text-gray-900 hover:bg-gray-50'
                }`}
                role="option"
                aria-selected={highlightedIndex === index}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-pink-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{suggestion.display_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}
