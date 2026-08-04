/**
 * NovaEstate Mobile - Lead Service
 * Reuses /api/v1/buyer and Realtor Lead Endpoints
 */

import apiClient from '@/api';
import { ApiResponse, Lead, LeadStatus } from '@/types';

export const LeadService = {
  getLeads: async (status?: LeadStatus | 'ALL'): Promise<ApiResponse<Lead[]>> => {
    return await apiClient.get<any, ApiResponse<Lead[]>>('/seller/valuations', { params: { status } });
  },

  getLeadById: async (id: string): Promise<ApiResponse<Lead>> => {
    return await apiClient.get<any, ApiResponse<Lead>>(`/seller/valuations/${id}`);
  },

  updateLeadStatus: async (id: string, status: LeadStatus): Promise<ApiResponse<Lead>> => {
    return await apiClient.patch<any, ApiResponse<Lead>>(`/seller/valuations/${id}/status`, { status });
  },

  addLeadNote: async (id: string, note: string): Promise<ApiResponse<Lead>> => {
    return await apiClient.post<any, ApiResponse<Lead>>(`/seller/valuations/${id}/notes`, { note });
  },
};

export default LeadService;
