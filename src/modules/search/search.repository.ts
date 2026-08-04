import { prisma } from '../../database/client.js';

export class SearchRepository {
  async fullTextSearch(query: string, options: any) {
    const skip = options.skip || 0;
    const take = options.take || 10;

    const where: any = {
      deletedAt: null,
      status: 'ACTIVE',
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { city: { contains: query } },
        { address: { contains: query } },
        { neighborhood: { contains: query } },
        { lifestyleTags: { contains: query } }
      ]
    };

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take,
        include: { images: { where: { isPrimary: true } }, community: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.property.count({ where })
    ]);

    return { items, total };
  }

  async getCommunities() {
    return prisma.community.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' }
    });
  }
}
