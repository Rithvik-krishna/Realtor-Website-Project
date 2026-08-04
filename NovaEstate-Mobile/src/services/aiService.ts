/**
 * NovaEstate Mobile - AI Engine Service
 * Reuses /api/v1/ai Endpoints
 */

import apiClient from '@/api';
import { ApiResponse, Property } from '@/types';

export interface AIAssistantResponse {
  reply: string;
  suggestedAction?: string;
  recommendedProperties?: Property[];
}

export const AIService = {
  searchParsePrompt: async (prompt: string): Promise<ApiResponse<Property[]>> => {
    return await apiClient.post<any, ApiResponse<Property[]>>('/ai/search-parse', { prompt });
  },

  getAIAssistantResponse: async (message: string): Promise<ApiResponse<AIAssistantResponse>> => {
    return await apiClient.post<any, ApiResponse<AIAssistantResponse>>('/ai/assistant', { prompt: message, message });
  },
};

export default AIService;
