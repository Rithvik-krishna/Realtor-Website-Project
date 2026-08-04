/**
 * NovaEstate Mobile - Properties Custom Query Hook
 */

import { useQuery } from '@tanstack/react-query';
import { PropertyService } from '@/services';

export function useProperties(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => PropertyService.getProperties(params),
  });
}

export function usePropertyDetails(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => PropertyService.getPropertyById(id),
    enabled: !!id,
  });
}
