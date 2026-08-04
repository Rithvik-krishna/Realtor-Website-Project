import { create } from 'zustand';
import { Property } from '@/types';

interface PropertyCompareState {
  comparedProperties: Property[];
  toggleCompareProperty: (property: Property) => void;
  removeCompareProperty: (propertyId: string) => void;
  clearCompare: () => void;
  isPropertyCompared: (propertyId: string) => boolean;
}

export const usePropertyCompareStore = create<PropertyCompareState>((set, get) => ({
  comparedProperties: [],

  toggleCompareProperty: (property) => {
    set((state) => {
      const exists = state.comparedProperties.some((p) => p.id === property.id);
      if (exists) {
        return { comparedProperties: state.comparedProperties.filter((p) => p.id !== property.id) };
      }
      // Max 4 properties allowed for comparison
      if (state.comparedProperties.length >= 4) {
        return state;
      }
      return { comparedProperties: [...state.comparedProperties, property] };
    });
  },

  removeCompareProperty: (propertyId) => {
    set((state) => ({
      comparedProperties: state.comparedProperties.filter((p) => p.id !== propertyId),
    }));
  },

  clearCompare: () => {
    set({ comparedProperties: [] });
  },

  isPropertyCompared: (propertyId) => {
    const { comparedProperties } = get();
    return comparedProperties.some((p) => p.id === propertyId);
  },
}));
