import React from 'react';
import { SearchDropdown } from './SearchDropdown';

interface BedsFilterProps {
  value: string;
  onChange: (val: string) => void;
}

const BEDS_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+'];

export const BedsFilter: React.FC<BedsFilterProps> = ({ value, onChange }) => {
  return (
    <SearchDropdown
      label="Bedrooms"
      value={value === 'All' ? 'Any' : value}
      options={BEDS_OPTIONS}
      onChange={(selected) => onChange(selected === 'Any' ? 'All' : selected)}
    />
  );
};
