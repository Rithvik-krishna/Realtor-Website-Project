/**
 * NovaEstate Mobile - Authentication Service
 * Reuses NovaEstate Backend /api/v1/auth Endpoints
 */

import apiClient from '@/api';
import { ApiResponse, User, UserRole } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  brokerageName?: string;
  licenseNumber?: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const AuthService = {
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiClient.post<any, ApiResponse<any>>('/auth/login', payload);
    if (response.data) {
      const rawUser = response.data.user || {};
      const tokens = response.data.tokens || {};
      const formattedUser: User = {
        id: rawUser.id || '',
        email: rawUser.email || '',
        firstName: rawUser.firstName || '',
        lastName: rawUser.lastName || '',
        phone: rawUser.phone,
        role: (rawUser.roles?.[0] || rawUser.role || 'BUYER') as UserRole,
        avatarUrl: rawUser.avatarUrl,
        brokerageName: rawUser.brokerageName,
        licenseNumber: rawUser.licenseNumber,
        createdAt: rawUser.createdAt || new Date().toISOString(),
      };
      return {
        ...response,
        data: {
          accessToken: tokens.accessToken || response.data.accessToken,
          refreshToken: tokens.refreshToken || response.data.refreshToken,
          user: formattedUser,
        },
      };
    }
    return response as any;
  },

  signup: async (payload: SignupPayload): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiClient.post<any, ApiResponse<any>>('/auth/signup', payload);
    if (response.data) {
      const rawUser = response.data.user || {};
      const tokens = response.data.tokens || {};
      const formattedUser: User = {
        id: rawUser.id || '',
        email: rawUser.email || '',
        firstName: rawUser.firstName || '',
        lastName: rawUser.lastName || '',
        phone: rawUser.phone,
        role: (rawUser.roles?.[0] || rawUser.role || payload.role || 'BUYER') as UserRole,
        avatarUrl: rawUser.avatarUrl,
        brokerageName: rawUser.brokerageName,
        licenseNumber: rawUser.licenseNumber,
        createdAt: rawUser.createdAt || new Date().toISOString(),
      };
      return {
        ...response,
        data: {
          accessToken: tokens.accessToken || response.data.accessToken,
          refreshToken: tokens.refreshToken || response.data.refreshToken,
          user: formattedUser,
        },
      };
    }
    return response as any;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken?: string }>> => {
    return await apiClient.post<any, ApiResponse<{ accessToken: string; refreshToken?: string }>>('/auth/refresh', {
      refreshToken,
    });
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return await apiClient.get<any, ApiResponse<User>>('/auth/me');
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return await apiClient.post<any, ApiResponse<void>>('/auth/logout');
  },
};

export default AuthService;
