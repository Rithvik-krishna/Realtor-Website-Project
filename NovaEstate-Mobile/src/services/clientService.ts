/**
 * NovaEstate Mobile - Client Service
 * Reuses Client Dossier & Preferences Endpoints
 */

import apiClient from '@/api';
import { ApiResponse, Client, Property } from '@/types';

export const ClientService = {
  getClients: async (): Promise<ApiResponse<Client[]>> => {
    return await apiClient.get<any, ApiResponse<Client[]>>('/admin/users');
  },

  getClientById: async (id: string): Promise<ApiResponse<Client>> => {
    return await apiClient.get<any, ApiResponse<Client>>(`/admin/users/${id}`);
  },

  getClientSavedProperties: async (clientId: string): Promise<ApiResponse<Property[]>> => {
    return await apiClient.get<any, ApiResponse<Property[]>>(`/buyer/saved-properties`, {
      params: { clientId },
    });
  },
};

export default ClientService;
