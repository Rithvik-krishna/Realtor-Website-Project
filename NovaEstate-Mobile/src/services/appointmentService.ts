/**
 * NovaEstate Mobile - Showing Appointment Service
 * Reuses /api/v1/appointments Endpoints
 */

import apiClient from '@/api';
import { ApiResponse, ShowingAppointment, AppointmentStatus } from '@/types';

export const AppointmentService = {
  getAppointments: async (): Promise<ApiResponse<ShowingAppointment[]>> => {
    return await apiClient.get<any, ApiResponse<ShowingAppointment[]>>('/appointments/my-appointments');
  },

  getAppointmentById: async (id: string): Promise<ApiResponse<ShowingAppointment>> => {
    return await apiClient.get<any, ApiResponse<ShowingAppointment>>(`/appointments/${id}`);
  },

  bookShowing: async (payload: {
    propertyId: string;
    appointmentDate: string;
    notes?: string;
  }): Promise<ApiResponse<ShowingAppointment>> => {
    return await apiClient.post<any, ApiResponse<ShowingAppointment>>('/appointments/book', payload);
  },

  updateAppointmentStatus: async (
    id: string,
    status: AppointmentStatus
  ): Promise<ApiResponse<ShowingAppointment>> => {
    return await apiClient.patch<any, ApiResponse<ShowingAppointment>>(`/appointments/${id}/status`, {
      status,
    });
  },
};

export default AppointmentService;
