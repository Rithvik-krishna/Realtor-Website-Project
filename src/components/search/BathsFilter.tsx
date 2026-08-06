import React from 'react';
import { SearchDropdown } from './SearchDropdown';

interface BathsFilterProps {
  value: string;
  onChange: (val: string) => void;
}

const BATHS_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+'];

export const BathsFilter: React.FC<BathsFilterProps> = ({ value, onChange }) => {
  return (
    <SearchDropdown
      label="Bathrooms"
      value={value === 'All' ? 'Any' : value}
      options={BATHS_OPTIONS}
      onChange={(selected) => onChange(selected === 'Any' ? 'All' : selected)}
    />
  );
};
