/**
 * NovaEstate Mobile - Market Intelligence & Valuation Service
 * Reuses /api/v1/analytics and /api/v1/seller Endpoints
 */

import apiClient from '@/api';
import { ApiResponse, MarketStats, HomeValuationRequest, HomeValuationResult } from '@/types';

export const MarketService = {
  getMarketStats: async (region = 'GTA'): Promise<ApiResponse<MarketStats>> => {
    return await apiClient.get<any, ApiResponse<MarketStats>>('/analytics/market', { params: { region } });
  },

  calculateValuation: async (data: HomeValuationRequest): Promise<ApiResponse<HomeValuationResult>> => {
    return await apiClient.post<any, ApiResponse<HomeValuationResult>>('/seller/valuation', data);
  },
};

export default MarketService;
