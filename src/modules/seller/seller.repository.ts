import { prisma } from '../../database/client.js';

export class SellerRepository {
  async createValuationRequest(data: {
    userId?: string;
    address: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    notes?: string;
    estimatedValueMin?: number;
    estimatedValueMax?: number;
  }) {
    return prisma.homeValuationRequest.create({ data });
  }

  async findComparables(city: string, bedrooms: number) {
    return prisma.property.findMany({
      where: {
        city: { contains: city },
        bedrooms: { gte: bedrooms - 1, lte: bedrooms + 1 },
        deletedAt: null,
        status: 'ACTIVE'
      },
      take: 3,
      select: {
        id: true,
        title: true,
        price: true,
        address: true,
        bedrooms: true,
        bathrooms: true,
        images: { where: { isPrimary: true }, select: { url: true } }
      }
    });
  }

  async getAllValuations() {
    return prisma.homeValuationRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}
