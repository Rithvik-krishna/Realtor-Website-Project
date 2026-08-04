import { prisma } from '../../database/client.js';

export class PropertyRepository {
  async findAll(params: {
    skip?: number;
    take?: number;
    city?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    isFeatured?: boolean;
    lifestyleTag?: string;
  }) {
    const where: any = {
      deletedAt: null,
      status: 'ACTIVE'
    };

    if (params.city) {
      where.city = { contains: params.city };
    }
    if (params.propertyType) {
      where.propertyType = params.propertyType;
    }
    if (params.minPrice || params.maxPrice) {
      where.price = {};
      if (params.minPrice) where.price.gte = params.minPrice;
      if (params.maxPrice) where.price.lte = params.maxPrice;
    }
    if (params.bedrooms) {
      where.bedrooms = { gte: params.bedrooms };
    }
    if (params.bathrooms) {
      where.bathrooms = { gte: params.bathrooms };
    }
    if (params.isFeatured !== undefined) {
      where.isFeatured = params.isFeatured;
    }
    if (params.lifestyleTag) {
      where.lifestyleTags = { contains: params.lifestyleTag };
    }

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip: params.skip || 0,
        take: params.take || 10,
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          features: true,
          community: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.property.count({ where })
    ]);

    return { items, total };
  }

  async findByIdOrSlug(identifier: string) {
    return prisma.property.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ],
        deletedAt: null
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        features: true,
        priceHistory: { orderBy: { createdAt: 'desc' } },
        community: true
      }
    });
  }

  async findByIds(ids: string[]) {
    return prisma.property.findMany({
      where: {
        id: { in: ids },
        deletedAt: null
      },
      include: {
        images: { where: { isPrimary: true } },
        community: true
      }
    });
  }

  async createProperty(data: any) {
    const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const imagesData = data.images || [];
    delete data.images;

    return prisma.property.create({
      data: {
        ...data,
        slug,
        images: {
          create: imagesData
        }
      },
      include: {
        images: true,
        features: true
      }
    });
  }
}
