/**
 * NovaEstate Mobile - Lead CRM React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LeadService } from '@/services/leadService';
import { LeadStatus } from '@/types';

export function useLeadsQuery(status?: LeadStatus | 'ALL') {
  return useQuery({
    queryKey: ['leads', status],
    queryFn: () => LeadService.getLeads(status),
    staleTime: 1000 * 60 * 3,
  });
}

export function useLeadDetailsQuery(id: string) {
  return useQuery({
    queryKey: ['leadDetails', id],
    queryFn: () => LeadService.getLeadById(id),
    enabled: !!id,
  });
}

export function useUpdateLeadStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) => LeadService.updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useAddLeadNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => LeadService.addLeadNote(id, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leadDetails', variables.id] });
    },
  });
}
