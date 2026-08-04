/**
 * NovaEstate Mobile - First-time Onboarding Preference Store
 */

import { create } from 'zustand';
import { storage } from '@/api';

const ONBOARDING_COMPLETED_KEY = 'novaestate_onboarding_completed';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  isCheckingOnboarding: boolean;
  checkOnboardingStatus: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasCompletedOnboarding: false,
  isCheckingOnboarding: true,

  checkOnboardingStatus: async () => {
    try {
      set({ isCheckingOnboarding: true });
      const completed = await storage.getItemAsync(ONBOARDING_COMPLETED_KEY);
      set({ hasCompletedOnboarding: completed === 'true' });
    } catch {
      set({ hasCompletedOnboarding: false });
    } finally {
      set({ isCheckingOnboarding: false });
    }
  },

  completeOnboarding: async () => {
    try {
      await storage.setItemAsync(ONBOARDING_COMPLETED_KEY, 'true');
      set({ hasCompletedOnboarding: true });
    } catch (error) {
      console.warn('Failed to persist onboarding status:', error);
    }
  },

  resetOnboarding: async () => {
    try {
      await storage.deleteItemAsync(ONBOARDING_COMPLETED_KEY);
      set({ hasCompletedOnboarding: false });
    } catch (error) {
      console.warn('Failed to reset onboarding status:', error);
    }
  },
}));

export default useOnboardingStore;
