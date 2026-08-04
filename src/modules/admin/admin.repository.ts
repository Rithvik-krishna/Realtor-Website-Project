import { prisma } from '../../database/client.js';

export class AdminRepository {
  async getDashboardStats() {
    const [totalUsers, totalProperties, totalAppointments, totalValuations] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.property.count({ where: { deletedAt: null } }),
      prisma.appointment.count(),
      prisma.homeValuationRequest.count()
    ]);

    return {
      totalUsers,
      totalProperties,
      totalAppointments,
      totalValuations
    };
  }

  async getAllUsers() {
    return prisma.user.findMany({
      where: { deletedAt: null },
      include: {
        userRoles: { include: { role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSyncLogs() {
    return prisma.syncJob.findMany({
      orderBy: { startedAt: 'desc' },
      take: 20
    });
  }
}
