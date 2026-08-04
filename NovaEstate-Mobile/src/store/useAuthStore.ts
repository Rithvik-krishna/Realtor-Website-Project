/**
 * NovaEstate Mobile - Production Zustand Auth Store with SecureStore Persistence
 */

import { create } from 'zustand';
import { KEYS, storage } from '@/api';
import { User, UserRole } from '@/types';
import { AuthService, LoginPayload, SignupPayload } from '@/services/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  initializeAuth: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const [storedAccessToken, storedRefreshToken, storedUserData] = await Promise.all([
        storage.getItemAsync(KEYS.ACCESS_TOKEN),
        storage.getItemAsync(KEYS.REFRESH_TOKEN),
        storage.getItemAsync(KEYS.USER_DATA),
      ]);

      if (storedAccessToken && storedUserData) {
        const user: User = JSON.parse(storedUserData);
        set({
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
          user,
          isAuthenticated: true,
        });

        // Optionally fetch latest profile in background
        try {
          const profileResponse = await AuthService.getCurrentUser();
          if (profileResponse.data) {
            set({ user: profileResponse.data });
            await storage.setItemAsync(KEYS.USER_DATA, JSON.stringify(profileResponse.data));
          }
        } catch {
          // Token still valid, silent background profile sync fail
        }
      } else {
        set({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null });
      }
    } catch (error: any) {
      console.warn('Failed to restore auth session:', error);
      set({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (payload: LoginPayload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await AuthService.login(payload);
      if (!response.data) {
        throw new Error('Invalid authentication response from server.');
      }
      const { accessToken, refreshToken, user } = response.data;

      await Promise.all([
        storage.setItemAsync(KEYS.ACCESS_TOKEN, accessToken),
        storage.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
        storage.setItemAsync(KEYS.USER_DATA, JSON.stringify(user)),
      ]);

      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (payload: SignupPayload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await AuthService.signup(payload);
      if (!response.data) {
        throw new Error('Invalid registration response from server.');
      }
      const { accessToken, refreshToken, user } = response.data;

      await Promise.all([
        storage.setItemAsync(KEYS.ACCESS_TOKEN, accessToken),
        storage.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
        storage.setItemAsync(KEYS.USER_DATA, JSON.stringify(user)),
      ]);

      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      try {
        await AuthService.logout();
      } catch {
        // Continue clearing client storage even if server logout fails
      }

      await Promise.all([
        storage.deleteItemAsync(KEYS.ACCESS_TOKEN),
        storage.deleteItemAsync(KEYS.REFRESH_TOKEN),
        storage.deleteItemAsync(KEYS.USER_DATA),
      ]);

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  hasRole: (roles: UserRole | UserRole[]) => {
    const currentUser = get().user;
    if (!currentUser) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(currentUser.role);
  },
}));

export default useAuthStore;
