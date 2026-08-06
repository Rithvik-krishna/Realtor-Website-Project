import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FilterField {
  id: string;
  label: string;
  type: 'select' | 'input' | 'button';
  placeholder?: string;
  options?: string[];
}

const FILTER_FIELDS: FilterField[] = [
  // Row 1
  { id: 'residential', label: 'Residential', type: 'select', options: ['Residential', 'Commercial', 'Industrial', 'Land'] },
  { id: 'priceRange', label: 'Price Range', type: 'select', options: ['Under $500k', '$500k - $1M', '$1M - $2M', '$2M - $5M', '$5M+'] },
  { id: 'homeType', label: 'Home Type', type: 'select', options: ['House', 'Apartment', 'Condo', 'Townhouse', 'Penthouse'] },
  
  // Row 2
  { id: 'forSale', label: 'For Sale', type: 'select', options: ['For Sale', 'For Rent', 'Sold'] },
  { id: 'beds', label: 'Beds', type: 'select', options: ['Any Beds', '1+ Beds', '2+ Beds', '3+ Beds', '4+ Beds', '5+ Beds'] },
  { id: 'baths', label: 'Baths', type: 'select', options: ['Any Baths', '1+ Baths', '1.5+ Baths', '2+ Baths', '3+ Baths', '4+ Baths'] },
  
  // Row 3
  { id: 'propertyType', label: 'Property Type', type: 'select', options: ['Single Family', 'Multi-Family', 'Apartment Building', 'Vacant Land'] },
  { id: 'squareFeet', label: 'Square Feet', type: 'select', options: ['Any Size', 'Under 1,000 sqft', '1,000 - 2,000 sqft', '2,000 - 3,000 sqft', '3,000 - 5,000 sqft', '5,000+ sqft'] },
  { id: 'daysOnMarket', label: 'Days On Market', type: 'select', options: ['Any Time', 'New (Today)', 'Less than 3 Days', 'Less than 7 Days', 'Less than 30 Days'] },
  
  // Row 4
  { id: 'showOnly', label: 'Show Only', type: 'select', options: ['All Listings', 'Open House Only', 'Virtual Tour Only', 'Price Reduced Only'] },
  { id: 'keywords', label: 'Keywords', type: 'input', placeholder: 'Enter keywords (e.g. pool, view)...' },
  { id: 'addButton', label: 'Add Filter', type: 'button' }
];

interface AdvancedSearchFiltersProps {
  isExpanded: boolean;
  onClose?: () => void;
}

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({ isExpanded, onClose }) => {
  const [selections, setSelectedValues] = useState<Record<string, string>>({
    residential: 'Residential',
    priceRange: 'Price Range',
    homeType: 'Home Type',
    forSale: 'For Sale',
    beds: 'Beds',
    baths: 'Baths',
    propertyType: 'Property Type',
    squareFeet: 'Square Feet',
    daysOnMarket: 'Days On Market',
    showOnly: 'Show Only'
  });

  const [keywordValue, setKeywordValue] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [highlightedOptionIndex, setHighlightedOptionIndex] = useState<number>(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (activeDropdownId) {
        const ref = dropdownRefs.current[activeDropdownId];
        if (ref && !ref.contains(event.target as Node)) {
          setActiveDropdownId(null);
          setHighlightedOptionIndex(-1);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activeDropdownId]);

  // Handle global Escape key to close open dropdowns or expanded panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeDropdownId) {
          setActiveDropdownId(null);
          setHighlightedOptionIndex(-1);
        } else if (isExpanded && onClose) {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeDropdownId, isExpanded, onClose]);

  const handleDropdownSelect = (fieldId: string, option: string) => {
    setSelectedValues(prev => ({ ...prev, [fieldId]: option }));
    setActiveDropdownId(null);
    setHighlightedOptionIndex(-1);
  };

  const toggleDropdown = (fieldId: string) => {
    if (activeDropdownId === fieldId) {
      setActiveDropdownId(null);
      setHighlightedOptionIndex(-1);
    } else {
      setActiveDropdownId(fieldId);
      setHighlightedOptionIndex(-1);
    }
  };

  const handleDropdownKeyDown = (event: React.KeyboardEvent, field: FilterField) => {
    if (!field.options) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (activeDropdownId !== field.id) {
        setActiveDropdownId(field.id);
        setHighlightedOptionIndex(0);
      } else {
        setHighlightedOptionIndex(prev => 
          prev < field.options!.length - 1 ? prev + 1 : prev
        );
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (activeDropdownId === field.id) {
        setHighlightedOptionIndex(prev => (prev > 0 ? prev - 1 : 0));
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeDropdownId === field.id && highlightedOptionIndex >= 0) {
        handleDropdownSelect(field.id, field.options[highlightedOptionIndex]);
      } else {
        toggleDropdown(field.id);
      }
    } else if (event.key === 'Tab') {
      setActiveDropdownId(null);
      setHighlightedOptionIndex(-1);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: isExpanded ? '1000px' : '0px',
        opacity: isExpanded ? 1 : 0,
        overflow: isExpanded ? 'visible' : 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
        marginTop: isExpanded ? '16px' : '0px',
        zIndex: 50
      }}
    >
      <style>{`
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          background: rgba(7, 13, 36, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(167, 139, 250, 0.2);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.65), 0 0 30px rgba(167, 139, 250, 0.05);
        }
        .filter-dropdown-trigger {
          width: 100%;
          height: 46px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(167, 139, 250, 0.15);
          border-radius: 12px;
          color: #ffffff;
          padding: 0 16px;
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }
        .filter-dropdown-trigger:hover, .filter-dropdown-trigger:focus-visible {
          background: rgba(167, 139, 250, 0.08);
          border-color: rgba(167, 139, 250, 0.4);
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.15);
        }
        .filter-input-field {
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
        .filter-input-field:hover, .filter-input-field:focus {
          background: rgba(167, 139, 250, 0.05);
          border-color: rgba(167, 139, 250, 0.4);
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.15);
        }
        .filter-action-btn {
          width: 100%;
          height: 46px;
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
          outline: none;
        }
        .filter-action-btn:hover, .filter-action-btn:focus-visible {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(124, 58, 237, 0.45);
        }
        .filter-action-btn:active {
          transform: translateY(0);
        }
        .filter-dropdown-menu {
          position: absolute;
          top: 115%;
          left: 0;
          width: 100%;
          background: rgba(10, 8, 30, 0.98);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(167, 139, 250, 0.35);
          border-radius: 14px;
          padding: 8px;
          list-style: none;
          margin: 0;
          z-index: 99999;
          box-shadow: 0 12px 30px rgba(0,0,0,0.8), 0 0 20px rgba(124, 58, 237, 0.1);
          max-height: 220px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
          animation: fade-in-slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .filter-dropdown-item {
          padding: 8px 12px;
          font-size: 0.8rem;
          border-radius: 8px;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .filter-dropdown-item:hover, .filter-dropdown-item.highlighted {
          background: rgba(167, 139, 250, 0.15) !important;
          color: var(--color-lavender) !important;
        }
        @media (max-width: 768px) {
          .filters-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            padding: 16px !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 480px) {
          .filters-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="filters-grid">
        {FILTER_FIELDS.map(field => {
          if (field.type === 'select') {
            const isOpen = activeDropdownId === field.id;
            return (
              <div
                key={field.id}
                ref={el => { dropdownRefs.current[field.id] = el; }}
                style={{ position: 'relative' }}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown(field.id)}
                  onKeyDown={e => handleDropdownKeyDown(e, field)}
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  className="filter-dropdown-trigger"
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selections[field.id]}
                  </span>
                  <ChevronDown
                    size={14}
                    style={{
                      color: 'var(--text-secondary)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </button>

                {isOpen && field.options && (
                  <ul role="listbox" className="filter-dropdown-menu">
                    {field.options.map((option, idx) => {
                      const isSelected = selections[field.id] === option;
                      const isHighlighted = idx === highlightedOptionIndex;
                      return (
                        <li
                          key={option}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleDropdownSelect(field.id, option)}
                          className={`filter-dropdown-item ${isHighlighted ? 'highlighted' : ''}`}
                        >
                          <span>{option}</span>
                          {isSelected && (
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: 'var(--color-lavender)'
                              }}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          } else if (field.type === 'input') {
            return (
              <div key={field.id}>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={keywordValue}
                  onChange={e => setKeywordValue(e.target.value)}
                  className="filter-input-field"
                  aria-label={field.label}
                />
              </div>
            );
          } else if (field.type === 'button') {
            return (
              <div key={field.id}>
                <button
                  type="button"
                  className="filter-action-btn"
                  onClick={() => {
                    alert(`Placeholder action: Filters submitted.`);
                  }}
                >
                  <span>{field.placeholder || 'Add Filter'}</span>
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
