import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SearchDropdownProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  width?: string;
  placeholder?: string;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  width = '100%',
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard navigation inside dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0) {
        onChange(options[highlightedIndex]);
        setIsOpen(false);
        setHighlightedIndex(-1);
      } else {
        setIsOpen(prev => !prev);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const displayValue = value || placeholder || 'Select option';

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', width }}
      onKeyDown={handleKeyDown}
    >
      <style>{`
        .search-dropdown-trigger {
          width: 100%;
          height: 44px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          color: #111827;
          padding: 0 16px;
          font-size: 0.88rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          text-align: left;
        }
        .search-dropdown-trigger:hover, .search-dropdown-trigger:focus-visible {
          background: #f1f5f9;
          border-color: #E31837;
          box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.12);
        }
        .search-dropdown-list {
          position: absolute;
          top: 115%;
          left: 0;
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 8px;
          list-style: none;
          margin: 0;
          z-index: 99999;
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          max-height: 240px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .search-dropdown-item {
          padding: 8px 12px;
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: 8px;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .search-dropdown-item:hover, .search-dropdown-item.highlighted {
          background: rgba(227, 24, 55, 0.08) !important;
          color: #E31837 !important;
          font-weight: 700;
        }
      `}</style>

      {label && (
        <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
          {label}
        </span>
      )}

      <button
        type="button"
        className="search-dropdown-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayValue}
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

      {isOpen && (
        <ul role="listbox" className="search-dropdown-list">
          {options.map((option, idx) => {
            const isSelected = value === option;
            const isHighlighted = idx === highlightedIndex;
            return (
              <li
                key={option}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setHighlightedIndex(-1);
                }}
                className={`search-dropdown-item ${isHighlighted ? 'highlighted' : ''}`}
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
};
