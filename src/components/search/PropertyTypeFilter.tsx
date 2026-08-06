import React from 'react';
import { SearchDropdown } from './SearchDropdown';

interface PropertyTypeFilterProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options?: string[];
}

const DEFAULT_TYPES = ['All', 'House', 'Condo', 'Apartment', 'Townhouse', 'Land', 'Commercial'];

export const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({
  label = 'Property Type',
  value,
  onChange,
  options = DEFAULT_TYPES
}) => {
  return (
    <SearchDropdown
      label={label}
      value={value === 'All' ? 'Any' : value}
      options={options}
      onChange={(selected) => onChange(selected === 'Any' ? 'All' : selected)}
    />
  );
};
