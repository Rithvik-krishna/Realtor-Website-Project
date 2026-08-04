/**
 * NovaEstate Mobile - Showing Appointment React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentService } from '@/services/appointmentService';
import { AppointmentStatus } from '@/types';

export function useAppointmentsQuery() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: () => AppointmentService.getAppointments(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAppointmentDetailsQuery(id: string) {
  return useQuery({
    queryKey: ['appointmentDetails', id],
    queryFn: () => AppointmentService.getAppointmentById(id),
    enabled: !!id,
  });
}

export function useBookShowingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { propertyId: string; appointmentDate: string; notes?: string }) =>
      AppointmentService.bookShowing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointmentStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      AppointmentService.updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
