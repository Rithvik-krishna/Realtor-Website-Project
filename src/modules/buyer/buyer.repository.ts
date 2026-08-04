import { prisma } from '../../database/client.js';

export class BuyerRepository {
  async getSavedProperties(userId: string) {
    return prisma.savedProperty.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            images: { where: { isPrimary: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async saveProperty(userId: string, propertyId: string) {
    return prisma.savedProperty.upsert({
      where: {
        userId_propertyId: { userId, propertyId }
      },
      create: { userId, propertyId },
      update: {}
    });
  }

  async removeSavedProperty(userId: string, propertyId: string) {
    return prisma.savedProperty.deleteMany({
      where: { userId, propertyId }
    });
  }

  async getSavedSearches(userId: string) {
    return prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async saveSearch(userId: string, title: string, filtersJson: string) {
    return prisma.savedSearch.create({
      data: { userId, title, filtersJson }
    });
  }
}
