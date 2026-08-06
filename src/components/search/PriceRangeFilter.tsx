import React from 'react';
import { SearchDropdown } from './SearchDropdown';

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onChange: (min: number, max: number) => void;
}

const MIN_PRICES = [
  { label: 'No Min', value: 0 },
  { label: '$250,000', value: 250000 },
  { label: '$500,000', value: 500000 },
  { label: '$750,000', value: 750000 },
  { label: '$1,000,000', value: 1000000 },
  { label: '$2,000,000', value: 2000000 },
  { label: '$5,000,000', value: 5000000 }
];

const MAX_PRICES = [
  { label: 'No Max', value: 50000000 },
  { label: '$250,000', value: 250000 },
  { label: '$500,000', value: 500000 },
  { label: '$750,000', value: 750000 },
  { label: '$1,000,000', value: 1000000 },
  { label: '$2,000,000', value: 2000000 },
  { label: '$5,000,000+', value: 50000000 }
];

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onChange
}) => {
  const currentMinObj = MIN_PRICES.find(p => p.value === minPrice) || MIN_PRICES[0];
  const currentMaxObj = MAX_PRICES.find(p => p.value === maxPrice) || MAX_PRICES[0];

  const handleMinChange = (selectedLabel: string) => {
    const found = MIN_PRICES.find(p => p.label === selectedLabel);
    const newMin = found ? found.value : 0;
    onChange(newMin, maxPrice);
  };

  const handleMaxChange = (selectedLabel: string) => {
    const found = MAX_PRICES.find(p => p.label === selectedLabel);
    const newMax = found ? found.value : 50000000;
    onChange(minPrice, newMax);
  };

  return (
    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
      <div style={{ flex: 1 }}>
        <SearchDropdown
          label="Min Price"
          value={currentMinObj.label}
          options={MIN_PRICES.map(p => p.label)}
          onChange={handleMinChange}
        />
      </div>
      <div style={{ flex: 1 }}>
        <SearchDropdown
          label="Max Price"
          value={currentMaxObj.label}
          options={MAX_PRICES.map(p => p.label)}
          onChange={handleMaxChange}
        />
      </div>
    </div>
  );
};
