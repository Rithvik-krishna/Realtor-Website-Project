/**
 * NovaEstate Mobile - Market Intelligence & Valuation React Query Hooks
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { MarketService } from '@/services/marketService';
import { HomeValuationRequest } from '@/types';

export function useMarketStatsQuery(region = 'GTA') {
  return useQuery({
    queryKey: ['marketStats', region],
    queryFn: () => MarketService.getMarketStats(region),
    staleTime: 1000 * 60 * 10, // 10 mins cache
  });
}

export function useValuationMutation() {
  return useMutation({
    mutationFn: (data: HomeValuationRequest) => MarketService.calculateValuation(data),
  });
}
