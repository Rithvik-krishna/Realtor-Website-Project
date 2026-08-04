import { prisma } from '../../database/client.js';

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return prisma.user.create({
      data,
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });
  }

  async assignRole(userId: string, roleName: 'GUEST' | 'BUYER' | 'SELLER' | 'AGENT' | 'ADMIN' | 'SUPER_ADMIN') {
    let role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      role = await prisma.role.create({ data: { name: roleName } });
    }

    return prisma.userRole.create({
      data: {
        userId,
        roleId: role.id
      }
    });
  }
}
