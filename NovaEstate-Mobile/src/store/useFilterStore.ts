/**
 * NovaEstate Mobile - Filter Store for Property Search
 */

import { create } from 'zustand';
import { PropertyType } from '@/types';

interface FilterState {
  city: string | null;
  propertyType: string | null;
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  minBathrooms: number;
  bedrooms: string;
  bathrooms: string;
  searchQuery: string;
  aiPrompt: string;
  setCity: (city: string | null) => void;
  setPropertyType: (type: string | null) => void;
  setPriceRange: (min: number, max: number) => void;
  setBedrooms: (bedrooms: string) => void;
  setBathrooms: (bathrooms: string) => void;
  setSearchQuery: (query: string) => void;
  setAiPrompt: (prompt: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const initialFilters = {
  city: null,
  propertyType: null,
  minPrice: 0,
  maxPrice: 10000000,
  minBedrooms: 0,
  minBathrooms: 0,
  bedrooms: 'ANY',
  bathrooms: 'ANY',
  searchQuery: '',
  aiPrompt: '',
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialFilters,
  setCity: (city) => set({ city }),
  setPropertyType: (propertyType) => set({ propertyType }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setBedrooms: (bedrooms) => set({ bedrooms }),
  setBathrooms: (bathrooms) => set({ bathrooms }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setAiPrompt: (aiPrompt) => set({ aiPrompt }),
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  resetFilters: () => set(initialFilters),
}));

export default useFilterStore;
