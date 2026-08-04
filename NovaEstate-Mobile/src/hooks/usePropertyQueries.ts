/**
 * NovaEstate Mobile - Property React Query Hooks (Pagination & Infinite Scroll)
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { PropertyService, PropertyQueryParams } from '@/services/propertyService';

export function usePropertiesQuery(params?: PropertyQueryParams) {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => PropertyService.getProperties(params),
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });
}

export function useInfinitePropertiesQuery(params?: Omit<PropertyQueryParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['infiniteProperties', params],
    queryFn: ({ pageParam = 1 }) =>
      PropertyService.getProperties({
        ...params,
        page: pageParam,
        limit: params?.limit ?? 60,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const page = lastPage.meta?.page || 1;
      const totalPages = lastPage.meta?.totalPages || 1;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function usePropertyDetailsQuery(identifier: string) {
  return useQuery({
    queryKey: ['propertyDetails', identifier],
    queryFn: () => PropertyService.getPropertyById(identifier),
    enabled: !!identifier,
  });
}
