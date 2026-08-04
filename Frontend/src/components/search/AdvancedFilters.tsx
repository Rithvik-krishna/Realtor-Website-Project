import React from 'react';
import { SearchDropdown } from './SearchDropdown';
import { PriceRangeFilter } from './PriceRangeFilter';
import { BedsFilter } from './BedsFilter';
import { BathsFilter } from './BathsFilter';
import { PropertyTypeFilter } from './PropertyTypeFilter';

interface AdvancedFiltersProps {
  isExpanded: boolean;
  filters: {
    propertyClass?: string;
    minPrice: number;
    maxPrice: number;
    homeType?: string;
    status?: string;
    beds: string;
    baths?: string;
    propertyType?: string;
    sqftMin?: number;
    sqftMax?: number;
    daysOnMarket?: string;
    showOnly?: string[];
    keywords?: string;
  };
  onChange: (updatedFilters: any) => void;
  onReset: () => void;
}

const PROPERTY_CLASSES = ['All', 'Residential', 'Condo', 'Townhouse', 'Commercial', 'Multi Family', 'Land'];

const HOME_TYPES = [
  'All', 'Detached', 'Semi Detached', 'Condo Apartment', 'Townhouse', 
  'Bungalow', 'Duplex', 'Triplex', 'Loft', 'Penthouse'
];

const STATUS_OPTIONS = ['All', 'For Sale', 'For Rent', 'Sold', 'Leased'];

const SQFT_MIN_OPTIONS = [
  { label: 'Any Min', value: 0 },
  { label: '500 sqft', value: 500 },
  { label: '1,000 sqft', value: 1000 },
  { label: '1,500 sqft', value: 1500 },
  { label: '2,000 sqft', value: 2000 },
  { label: '3,000 sqft+', value: 3000 }
];

const SQFT_MAX_OPTIONS = [
  { label: 'Any Max', value: 99999 },
  { label: '1,000 sqft', value: 1000 },
  { label: '1,500 sqft', value: 1500 },
  { label: '2,000 sqft', value: 2000 },
  { label: '3,000 sqft', value: 3000 }
];

const DOM_OPTIONS = ['Any', '1 Day', '7 Days', '14 Days', '30 Days', '90 Days'];

const SHOW_ONLY_OPTIONS = [
  'Open House', 'New Listings', 'Price Reduced', 'Waterfront', 
  'Luxury', 'Swimming Pool', 'Garage', 'Basement', 'Pet Friendly'
];

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isExpanded,
  filters,
  onChange,
  onReset
}) => {
  const handleSingleSelectChange = (key: string, val: string) => {
    onChange({ [key]: val === 'All' || val === 'Any' ? undefined : val });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onChange({ minPrice: min, maxPrice: max });
  };

  const handleSqftMinChange = (selectedLabel: string) => {
    const found = SQFT_MIN_OPTIONS.find(o => o.label === selectedLabel);
    onChange({ sqftMin: found ? found.value : undefined });
  };

  const handleSqftMaxChange = (selectedLabel: string) => {
    const found = SQFT_MAX_OPTIONS.find(o => o.label === selectedLabel);
    onChange({ sqftMax: found ? found.value : undefined });
  };

  const handleShowOnlyToggle = (option: string) => {
    const currentList = filters.showOnly || [];
    const newList = currentList.includes(option)
      ? currentList.filter(item => item !== option)
      : [...currentList, option];
    onChange({ showOnly: newList.length > 0 ? newList : undefined });
  };

  // Safe fallback descriptors
  const selectedSqftMinLabel = SQFT_MIN_OPTIONS.find(o => o.value === filters.sqftMin)?.label || 'Any Min';
  const selectedSqftMaxLabel = SQFT_MAX_OPTIONS.find(o => o.value === filters.sqftMax)?.label || 'Any Max';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: isExpanded ? '1200px' : '0px',
        opacity: isExpanded ? 1 : 0,
        overflow: isExpanded ? 'visible' : 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
        marginTop: isExpanded ? '20px' : '0px',
        zIndex: 90
      }}
    >
      <style>{`
        .adv-filters-container {
          background: rgba(7, 13, 36, 0.95);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(167, 139, 250, 0.22);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.7), 0 0 40px rgba(167, 139, 250, 0.04);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .adv-row-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .show-only-header {
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .show-only-pills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .show-only-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(167, 139, 250, 0.15);
          color: var(--text-secondary);
          padding: 8px 16px;
          font-size: 0.78rem;
          font-weight: 500;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          user-select: none;
        }
        .show-only-pill:hover, .show-only-pill:focus-visible {
          background: rgba(167, 139, 250, 0.08);
          border-color: rgba(167, 139, 250, 0.4);
          color: #ffffff;
        }
        .show-only-pill.active {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(79, 70, 229, 0.25) 100%);
          border-color: rgba(167, 139, 250, 0.65);
          color: #ffffff;
          box-shadow: 0 0 10px rgba(124, 58, 237, 0.15);
        }
        .adv-keyword-input {
          width: 100%;
          height: 46px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(167, 139, 250, 0.15);
          border-radius: 12px;
          color: #ffffff;
          padding: 0 16px;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s ease;
          outline: none;
        }
        .adv-keyword-input:hover, .adv-keyword-input:focus {
          background: rgba(167, 139, 250, 0.05);
          border-color: rgba(167, 139, 250, 0.4);
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.15);
        }
        .adv-reset-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          border-radius: 12px;
          padding: 0 18px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          height: 46px;
        }
        .adv-reset-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
        @media (max-width: 768px) {
          .adv-row-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px;
          }
        }
        @media (max-width: 480px) {
          .adv-row-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="adv-filters-container">
        {/* ROW 1 */}
        <div className="adv-row-grid">
          <PropertyTypeFilter
            label="Residential / Class"
            value={filters.propertyClass || 'All'}
            onChange={(val) => handleSingleSelectChange('propertyClass', val)}
            options={PROPERTY_CLASSES}
          />

          <PriceRangeFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onChange={handlePriceRangeChange}
          />

          <SearchDropdown
            label="Home Type"
            value={filters.homeType || 'All'}
            options={HOME_TYPES}
            onChange={(val) => handleSingleSelectChange('homeType', val)}
          />
        </div>

        {/* ROW 2 */}
        <div className="adv-row-grid">
          <SearchDropdown
            label="Property Status"
            value={filters.status || 'All'}
            options={STATUS_OPTIONS}
            onChange={(val) => handleSingleSelectChange('status', val)}
          />

          <BedsFilter
            value={filters.beds}
            onChange={(val) => onChange({ beds: val })}
          />

          <BathsFilter
            value={filters.baths || 'All'}
            onChange={(val) => handleSingleSelectChange('baths', val)}
          />
        </div>

        {/* ROW 3 */}
        <div className="adv-row-grid">
          <PropertyTypeFilter
            label="Property Type"
            value={filters.propertyType || 'All'}
            onChange={(val) => handleSingleSelectChange('propertyType', val)}
          />

          {/* Square Feet Dual Dropdowns */}
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <SearchDropdown
                label="Min Sqft"
                value={selectedSqftMinLabel}
                options={SQFT_MIN_OPTIONS.map(o => o.label)}
                onChange={handleSqftMinChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <SearchDropdown
                label="Max Sqft"
                value={selectedSqftMaxLabel}
                options={SQFT_MAX_OPTIONS.map(o => o.label)}
                onChange={handleSqftMaxChange}
              />
            </div>
          </div>

          <SearchDropdown
            label="Days On Market"
            value={filters.daysOnMarket || 'Any'}
            options={DOM_OPTIONS}
            onChange={(val) => handleSingleSelectChange('daysOnMarket', val)}
          />
        </div>

        {/* ROW 4 */}
        <div>
          <div className="show-only-header">Show Only</div>
          <div className="show-only-pills-container">
            {SHOW_ONLY_OPTIONS.map(option => {
              const isActive = (filters.showOnly || []).includes(option);
              return (
                <button
                  type="button"
                  key={option}
                  className={`show-only-pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleShowOnlyToggle(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
              Keywords
            </span>
            <input
              type="text"
              placeholder="e.g. pool, garage, basement, view"
              className="adv-keyword-input"
              value={filters.keywords || ''}
              onChange={e => onChange({ keywords: e.target.value || undefined })}
            />
          </div>
          <button
            type="button"
            className="adv-reset-btn"
            onClick={onReset}
          >
            Clear & Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
