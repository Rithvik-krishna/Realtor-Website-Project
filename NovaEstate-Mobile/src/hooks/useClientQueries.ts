/**
 * NovaEstate Mobile - Client React Query Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { ClientService } from '@/services/clientService';

export function useClientsQuery() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => ClientService.getClients(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useClientDetailsQuery(id: string) {
  return useQuery({
    queryKey: ['clientDetails', id],
    queryFn: () => ClientService.getClientById(id),
    enabled: !!id,
  });
}

export function useClientSavedPropertiesQuery(clientId: string) {
  return useQuery({
    queryKey: ['clientSavedProperties', clientId],
    queryFn: () => ClientService.getClientSavedProperties(clientId),
    enabled: !!clientId,
  });
}
