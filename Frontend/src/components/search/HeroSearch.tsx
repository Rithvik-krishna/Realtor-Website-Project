import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchDropdown } from './SearchDropdown';
import { SearchInput } from './SearchInput';
import { SearchButton } from './SearchButton';
import { AdvancedFilters } from './AdvancedFilters';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HeroSearchProps {
  onToggleExpand?: (isExpanded: boolean) => void;
}

const SEARCH_BY_OPTIONS = [
  { value: 'all', label: 'Search All' },
  { value: 'city', label: 'City' },
  { value: 'neighbourhood', label: 'Neighbourhood' },
  { value: 'address', label: 'Address' },
  { value: 'postalCode', label: 'Postal Code' },
  { value: 'mls', label: 'MLS® Number' }
];

export const HeroSearch: React.FC<HeroSearchProps> = ({ onToggleExpand }) => {
  const {
    activeFilters,
    setActiveFilters,
    setSearchQuery,
    setCurrentPage,
    showToast
  } = useApp();

  const [searchType, setSearchType] = useState('all');
  const [queryValue, setQueryValue] = useState('');
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);

  // Advanced filters local staging state
  const [localFilters, setLocalFilters] = useState({
    propertyClass: 'All',
    minPrice: 0,
    maxPrice: 50000000,
    homeType: 'All',
    status: 'All',
    beds: 'All',
    baths: 'All',
    propertyType: 'All',
    sqftMin: 0,
    sqftMax: 99999,
    daysOnMarket: 'Any',
    showOnly: [] as string[],
    keywords: ''
  });

  // Sync with AppContext initial filters if present
  useEffect(() => {
    setLocalFilters({
      propertyClass: activeFilters.propertyClass || 'All',
      minPrice: activeFilters.priceRange ? activeFilters.priceRange[0] : 0,
      maxPrice: activeFilters.priceRange ? activeFilters.priceRange[1] : 50000000,
      homeType: activeFilters.homeType || 'All',
      status: activeFilters.status || 'All',
      beds: activeFilters.beds || 'All',
      baths: activeFilters.baths || 'All',
      propertyType: activeFilters.propertyType || 'All',
      sqftMin: activeFilters.sqftMin || 0,
      sqftMax: activeFilters.sqftMax || 99999,
      daysOnMarket: activeFilters.daysOnMarket || 'Any',
      showOnly: activeFilters.showOnly || [],
      keywords: activeFilters.keywords || ''
    });
  }, [activeFilters]);

  const handleAdvancedChange = (updated: any) => {
    setLocalFilters(prev => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setLocalFilters({
      propertyClass: 'All',
      minPrice: 0,
      maxPrice: 50000000,
      homeType: 'All',
      status: 'All',
      beds: 'All',
      baths: 'All',
      propertyType: 'All',
      sqftMin: 0,
      sqftMax: 99999,
      daysOnMarket: 'Any',
      showOnly: [],
      keywords: ''
    });
    showToast('Filters cleared to default settings.', 'info');
  };

  const toggleAdvanced = () => {
    const nextState = !isAdvancedExpanded;
    setIsAdvancedExpanded(nextState);
    if (onToggleExpand) {
      onToggleExpand(nextState);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Check validation warnings
    const hasQuery = queryValue.trim().length > 0;
    const hasKeywords = (localFilters.keywords || '').trim().length > 0;
    const isFiltered = 
      localFilters.propertyClass !== 'All' ||
      localFilters.homeType !== 'All' ||
      localFilters.status !== 'All' ||
      localFilters.beds !== 'All' ||
      localFilters.baths !== 'All' ||
      localFilters.propertyType !== 'All' ||
      localFilters.minPrice > 0 ||
      localFilters.maxPrice < 50000000 ||
      localFilters.showOnly.length > 0;

    if (!hasQuery && !hasKeywords && !isFiltered) {
      showToast('Please enter a location, MLS number, or keyword filters.', 'warning');
      return;
    }

    // Map basic search query depending on types
    const updatedFilters: any = {
      city: 'All',
      beds: localFilters.beds,
      baths: localFilters.baths,
      category: localFilters.propertyType || 'All',
      propertyType: localFilters.propertyType || 'All',
      priceRange: [localFilters.minPrice, localFilters.maxPrice],
      propertyClass: localFilters.propertyClass === 'All' ? undefined : localFilters.propertyClass,
      homeType: localFilters.homeType === 'All' ? undefined : localFilters.homeType,
      status: localFilters.status === 'All' ? undefined : localFilters.status,
      sqftMin: localFilters.sqftMin || undefined,
      sqftMax: localFilters.sqftMax === 99999 ? undefined : localFilters.sqftMax,
      daysOnMarket: localFilters.daysOnMarket === 'Any' ? undefined : localFilters.daysOnMarket,
      showOnly: localFilters.showOnly.length > 0 ? localFilters.showOnly : undefined,
      keywords: localFilters.keywords || undefined,
      searchType
    };

    if (searchType === 'city') {
      updatedFilters.city = queryValue;
    } else if (searchType === 'postalCode') {
      updatedFilters.postalCode = queryValue;
    } else if (searchType === 'mls') {
      updatedFilters.mlsNumber = queryValue;
    } else if (searchType === 'neighbourhood') {
      updatedFilters.community = queryValue;
    } else if (searchType === 'address') {
      updatedFilters.address = queryValue;
    }

    setSearchQuery(queryValue);
    setActiveFilters(updatedFilters);
    setCurrentPage('search');
    showToast('Search query applied successfully.', 'success');
  };

  const currentOptionLabel = SEARCH_BY_OPTIONS.find(o => o.value === searchType)?.label || 'Search All';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', zIndex: 1000 }}>
      <style>{`
        .hero-search-bar-wrap {
          display: flex;
          align-items: center;
          background: rgba(10, 8, 30, 0.65);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(167, 139, 250, 0.25);
          border-radius: 50px;
          width: 100%;
          max-width: 720px;
          padding: 6px 8px 6px 16px;
          gap: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(124, 58, 237, 0.1);
          transition: all 0.3s ease;
        }
        .hero-search-bar-wrap:focus-within {
          border-color: rgba(167, 139, 250, 0.6);
          box-shadow: 0 15px 45px rgba(0,0,0,0.6), 0 0 30px rgba(124, 58, 237, 0.25);
        }
        .search-by-selector-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(167, 139, 250, 0.1);
          border-radius: 30px;
          height: 38px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .search-by-selector-btn:hover {
          background: rgba(167, 139, 250, 0.08);
          border-color: rgba(167, 139, 250, 0.3);
        }
        .search-vertical-divider {
          width: 1px;
          height: 26px;
          background: rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }
        .more-options-toggle-btn {
          background: none;
          border: none;
          color: rgba(167, 139, 250, 0.95);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          outline: none;
          text-shadow: 0 0 8px rgba(124, 58, 237, 0.2);
        }
        .more-options-toggle-btn:hover {
          color: #ffffff;
          text-shadow: 0 0 12px rgba(167, 139, 250, 0.6);
        }
        @media (max-width: 640px) {
          .hero-search-bar-wrap {
            flex-direction: column;
            border-radius: 20px;
            padding: 16px;
            align-items: stretch;
            gap: 12px;
          }
          .search-vertical-divider {
            display: none;
          }
        }
      `}</style>

      <form onSubmit={handleSearchSubmit} style={{ width: '100%', maxWidth: '720px' }}>
        <div className="hero-search-bar-wrap">
          {/* SEARCH BY DROPDOWN */}
          <div style={{ flexShrink: 0 }}>
            <SearchDropdown
              value={currentOptionLabel}
              options={SEARCH_BY_OPTIONS.map(o => o.label)}
              onChange={(lbl) => {
                const val = SEARCH_BY_OPTIONS.find(o => o.label === lbl)?.value || 'all';
                setSearchType(val);
                setQueryValue('');
              }}
              width="140px"
            />
          </div>

          <div className="search-vertical-divider" />

          {/* BASIC SEARCH INPUT */}
          <SearchInput
            searchType={searchType}
            value={queryValue}
            onChange={setQueryValue}
            onSearch={(val) => {
              setQueryValue(val);
              // Submit on selection to offer instantaneous response
              setTimeout(() => handleSearchSubmit(), 50);
            }}
          />

          {/* SUBMIT BUTTON */}
          <SearchButton isLoading={false} />
        </div>
      </form>

      {/* MORE OPTIONS EXPANDABLE CLICK */}
      <button
        type="button"
        className="more-options-toggle-btn"
        onClick={toggleAdvanced}
        aria-expanded={isAdvancedExpanded}
      >
        <span>For more options CLICK HERE</span>
        {isAdvancedExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* EXPANDABLE FILTER GRID PANEL */}
      <AdvancedFilters
        isExpanded={isAdvancedExpanded}
        filters={localFilters}
        onChange={handleAdvancedChange}
        onReset={handleReset}
      />
    </div>
  );
};
