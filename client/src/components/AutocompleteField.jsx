import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getRecentPicks, saveRecentPick } from '../utils/addressUtils';
import { API_ENDPOINTS } from '../config/api';

/**
 * Reusable autocomplete field component for address inputs
 */
export default function AutocompleteField({
  label,
  placeholder,
  value,
  onChange,
  onPick,
  queryType,
  country = 'PL',
  lang = 'en',
  disabled = false,
  required = false,
  className = ''
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [recentPicks, setRecentPicks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [abortController, setAbortController] = useState(null);
  
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const wrapperRef = useRef(null);

  // Load recent picks on mount
  useEffect(() => {
    const recent = getRecentPicks(queryType, country);
    setRecentPicks(recent);
  }, [queryType, country]);

  // Fetch suggestions from backend
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Cancel previous request
    if (abortController) {
      abortController.abort();
    }

    const newController = new AbortController();
    setAbortController(newController);
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        type: queryType,
        country: country,
        lang: lang
      });

      const response = await fetch(`${API_ENDPOINTS.GEOCODE_SEARCH}?${params.toString()}`, {
        signal: newController.signal
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setIsOpen(true);
        setHighlightedIndex(-1);
      } else {
        console.error('Error fetching suggestions:', response.statusText);
        setSuggestions([]);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [queryType, country, lang, abortController]);

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(e);

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new debounce timer
    const timer = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 250);

    setDebounceTimer(timer);
  };

  // Handle suggestion pick
  const handlePick = (suggestion) => {
    saveRecentPick(queryType, country, suggestion);
    setRecentPicks([suggestion, ...recentPicks.filter(r => r.display_name !== suggestion.display_name)].slice(0, 10));
    onPick(suggestion);
    setIsOpen(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && value.length >= 2) {
        fetchSuggestions(value);
      }
      return;
    }

    const allItems = [...(recentPicks.length > 0 ? recentPicks : []), ...suggestions];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < allItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && allItems[highlightedIndex]) {
          handlePick(allItems[highlightedIndex]);
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

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      if (abortController) {
        abortController.abort();
      }
    };
  }, [debounceTimer, abortController]);

  const allItems = isOpen ? [...(recentPicks.length > 0 && value.length < 2 ? recentPicks : []), ...suggestions] : [];
  const showRecent = isOpen && value.length < 2 && recentPicks.length > 0;
  const showSuggestions = isOpen && suggestions.length > 0;
  const showNoResults = isOpen && !isLoading && value.length >= 2 && suggestions.length === 0 && !showRecent;

  return (
    <div ref={wrapperRef} className="relative group">
      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.length >= 2) {
              fetchSuggestions(value);
            } else if (recentPicks.length > 0) {
              setIsOpen(true);
            }
          }}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400 ${className}`}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${queryType}-listbox`}
          aria-activedescendant={highlightedIndex >= 0 ? `${queryType}-option-${highlightedIndex}` : undefined}
          aria-autocomplete="list"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div
          ref={listRef}
          id={`${queryType}-listbox`}
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-white border-2 border-pink-200 rounded-xl shadow-xl max-h-80 overflow-y-auto"
        >
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </div>
          )}

          {showRecent && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-200">
                Recent
              </div>
              {recentPicks.map((item, index) => (
                <div
                  key={`recent-${index}`}
                  id={`${queryType}-option-${index}`}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  onClick={() => handlePick(item)}
                  className={`px-4 py-3 cursor-pointer text-sm transition-colors ${
                    highlightedIndex === index
                      ? 'bg-pink-50 text-pink-900'
                      : 'hover:bg-pink-50 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{item.display_name}</div>
                </div>
              ))}
            </>
          )}

          {showSuggestions && (
            <>
              {showRecent && recentPicks.length > 0 && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-200">
                  Suggestions
                </div>
              )}
              {suggestions.map((item, index) => {
                const actualIndex = showRecent ? recentPicks.length + index : index;
                return (
                  <div
                    key={item.place_id}
                    id={`${queryType}-option-${actualIndex}`}
                    role="option"
                    aria-selected={highlightedIndex === actualIndex}
                    onClick={() => handlePick(item)}
                    className={`px-4 py-3 cursor-pointer text-sm transition-colors ${
                      highlightedIndex === actualIndex
                        ? 'bg-pink-50 text-pink-900'
                        : 'hover:bg-pink-50 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{item.display_name}</div>
                  </div>
                );
              })}
            </>
          )}

          {showNoResults && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found. You can still type manually.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

