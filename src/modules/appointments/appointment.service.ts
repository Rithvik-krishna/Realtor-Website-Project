import { AppointmentRepository } from './appointment.repository.js';

export class AppointmentService {
  private appointmentRepo: AppointmentRepository;

  constructor() {
    this.appointmentRepo = new AppointmentRepository();
  }

  async bookAppointment(data: {
    buyerId: string;
    propertyId?: string;
    agentId?: string;
    appointmentDate: string;
    notes?: string;
  }) {
    return this.appointmentRepo.createAppointment({
      ...data,
      appointmentDate: new Date(data.appointmentDate)
    });
  }

  async getBuyerAppointments(buyerId: string) {
    return this.appointmentRepo.getBuyerAppointments(buyerId);
  }

  async getAgentAppointments(agentId: string) {
    return this.appointmentRepo.getAgentAppointments(agentId);
  }

  async updateAppointmentStatus(id: string, status: string) {
    return this.appointmentRepo.updateStatus(id, status as any);
  }
}
