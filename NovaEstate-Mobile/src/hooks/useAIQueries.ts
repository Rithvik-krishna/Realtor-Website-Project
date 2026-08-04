/**
 * NovaEstate Mobile - AI Engine React Query Hooks
 */

import { useMutation } from '@tanstack/react-query';
import { AIService } from '@/services/aiService';

export function useAISearchParseMutation() {
  return useMutation({
    mutationFn: (prompt: string) => AIService.searchParsePrompt(prompt),
  });
}

export function useAIAssistantMutation() {
  return useMutation({
    mutationFn: (message: string) => AIService.getAIAssistantResponse(message),
  });
}
