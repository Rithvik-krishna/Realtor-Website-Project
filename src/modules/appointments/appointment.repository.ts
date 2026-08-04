import { prisma } from '../../database/client.js';

export class AppointmentRepository {
  async createAppointment(data: {
    buyerId: string;
    propertyId?: string;
    agentId?: string;
    appointmentDate: Date;
    notes?: string;
  }) {
    return prisma.appointment.create({
      data,
      include: {
        buyer: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        agent: { select: { id: true, firstName: true, lastName: true, email: true } }
      }
    });
  }

  async getBuyerAppointments(buyerId: string) {
    return prisma.appointment.findMany({
      where: { buyerId },
      orderBy: { appointmentDate: 'asc' }
    });
  }

  async getAgentAppointments(agentId: string) {
    return prisma.appointment.findMany({
      where: { agentId },
      include: {
        buyer: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } }
      },
      orderBy: { appointmentDate: 'asc' }
    });
  }

  async updateStatus(id: string, status: any) {
    return prisma.appointment.update({
      where: { id },
      data: { status }
    });
  }
}
