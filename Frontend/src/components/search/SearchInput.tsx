import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, School } from 'lucide-react';

interface SearchInputProps {
  searchType: string;
  value: string;
  onChange: (val: string) => void;
  onSearch: (val: string) => void;
}

const PLACEHOLDERS: Record<string, string> = {
  all: 'Search properties...',
  city: 'Enter city name',
  neighbourhood: 'Enter neighbourhood',
  address: 'Enter property address',
  postalCode: 'Enter postal code (e.g. M5V)',
  mls: 'Enter MLS® number (e.g. C1234567)'
};

// Autocomplete database pool matching existing luxury listing clusters
const AUTOCOMPLETE_POOL = [
  { type: 'city', title: 'Toronto', sub: 'Ontario, Canada' },
  { type: 'city', title: 'Mississauga', sub: 'Ontario, Canada' },
  { type: 'city', title: 'Oakville', sub: 'Ontario, Canada' },
  { type: 'city', title: 'Brampton', sub: 'Ontario, Canada' },
  { type: 'city', title: 'Hamilton', sub: 'Ontario, Canada' },
  { type: 'city', title: 'Vaughan', sub: 'Ontario, Canada' },
  { type: 'city', title: 'Markham', sub: 'Ontario, Canada' },
  { type: 'neighbourhood', title: 'Yorkville', sub: 'Toronto, ON' },
  { type: 'neighbourhood', title: 'Forest Hill', sub: 'Toronto, ON' },
  { type: 'neighbourhood', title: 'Rosedale', sub: 'Toronto, ON' },
  { type: 'neighbourhood', title: 'West Vancouver', sub: 'Vancouver, BC' },
  { type: 'neighbourhood', title: 'The Bridle Path', sub: 'Toronto, ON' },
  { type: 'address', title: '102 Radcliffe Ridge', sub: 'Toronto, ON' },
  { type: 'address', title: '88 Highland Crescent', sub: 'Toronto, ON' },
  { type: 'address', title: '42 Lakeshore Blvd', sub: 'Oakville, ON' },
  { type: 'postalCode', title: 'M5V 2H1', sub: 'Downtown Toronto, ON' },
  { type: 'postalCode', title: 'L6J 1J8', sub: 'Oakville, ON' },
  { type: 'mls', title: 'C8210342', sub: 'Active TRREB Listing' },
  { type: 'mls', title: 'C9014281', sub: 'Active TRREB Listing' }
];

export const SearchInput: React.FC<SearchInputProps> = ({
  searchType,
  value,
  onChange,
  onSearch
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Sync state when parent value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounced input search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const query = inputValue.trim().toLowerCase();
    if (!query) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      // Fuzzy filter suggestions pool
      const matched = AUTOCOMPLETE_POOL.filter(item => {
        const queryMatches = item.title.toLowerCase().includes(query) || item.sub.toLowerCase().includes(query);
        // If specific search type selected, only show matching categories
        if (searchType !== 'all') {
          return queryMatches && item.type === searchType;
        }
        return queryMatches;
      });

      setSuggestions(matched.slice(0, 6));
      setIsLoading(false);
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [inputValue, searchType]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectSuggestion = (title: string) => {
    onChange(title);
    setInputValue(title);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSearch(title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
      }
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[highlightedIndex].title);
      } else if (inputValue.trim()) {
        e.preventDefault();
        onSearch(inputValue);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const placeholder = PLACEHOLDERS[searchType] || 'Search properties...';

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', flex: 1, minWidth: '220px' }}
      onKeyDown={handleKeyDown}
    >
      <style>{`
        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          height: 48px;
        }
        .search-input-field {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          color: #ffffff;
          padding-left: 44px;
          padding-right: 44px;
          font-size: 0.9rem;
          font-weight: 500;
          outline: none;
        }
        .search-input-icon {
          position: absolute;
          left: 16px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .search-input-action-btn {
          position: absolute;
          right: 14px;
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        .search-input-action-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }
        .search-suggestion-list {
          position: absolute;
          top: 115%;
          left: 0;
          width: 100%;
          background: rgba(7, 13, 36, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(167, 139, 250, 0.25);
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.8);
          padding: 8px;
          list-style: none;
          margin: 0;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .search-suggestion-item {
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.15s ease;
        }
        .search-suggestion-item:hover, .search-suggestion-item.highlighted {
          background: rgba(167, 139, 250, 0.15) !important;
        }
      `}</style>

      <div className="search-input-container">
        <div className="search-input-icon">
          <Search size={16} />
        </div>

        <input
          type="text"
          className="search-input-field"
          placeholder={placeholder}
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          aria-autocomplete="list"
          aria-expanded={isOpen && suggestions.length > 0}
        />

        {inputValue && (
          <button
            type="button"
            className="search-input-action-btn"
            onClick={() => {
              setInputValue('');
              onChange('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            aria-label="Clear search input"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (suggestions.length > 0 || isLoading) && (
        <ul className="search-suggestion-list" role="listbox">
          {isLoading ? (
            <li style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Searching listings...
            </li>
          ) : (
            suggestions.map((item, idx) => {
              const isHighlighted = idx === highlightedIndex;
              return (
                <li
                  key={`${item.type}-${item.title}`}
                  role="option"
                  aria-selected={isHighlighted}
                  onClick={() => handleSelectSuggestion(item.title)}
                  className={`search-suggestion-item ${isHighlighted ? 'highlighted' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(167, 139, 250, 0.1)', border: '1px solid rgba(167, 139, 250, 0.15)', color: 'var(--color-lavender)' }}>
                      {item.type === 'school' ? <School size={12} /> : <MapPin size={12} />}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>{item.title}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.sub}</span>
                    </div>
                  </div>
                  <span className="badge badge-lavender" style={{ fontSize: '0.62rem', padding: '2px 8px', background: 'rgba(167, 139, 250, 0.08)' }}>
                    {item.type.toUpperCase()}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};
