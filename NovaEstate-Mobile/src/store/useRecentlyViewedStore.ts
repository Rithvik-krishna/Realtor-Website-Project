import { create } from 'zustand';
import { Property } from '@/types';

interface RecentlyViewedState {
  recentlyViewed: Property[];
  addViewedProperty: (property: Property) => void;
  clearHistory: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>((set) => ({
  recentlyViewed: [],

  addViewedProperty: (property) => {
    set((state) => {
      // Remove existing occurrence if any
      const filtered = state.recentlyViewed.filter((p) => p.id !== property.id);
      // Prepend to top and cap at max 20 properties
      const updated = [property, ...filtered].slice(0, 20);
      return { recentlyViewed: updated };
    });
  },

  clearHistory: () => {
    set({ recentlyViewed: [] });
  },
}));
