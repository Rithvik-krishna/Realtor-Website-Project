import { prisma } from '../../database/client.js';

export class PropertyRepository {
  async findAll(params: any) {
    const where: any = {
      deletedAt: null
    };

    // 1. Status Filter
    if (params.status && params.status !== 'All' && params.status !== 'Any') {
      const st = String(params.status).toUpperCase().trim();
      if (st === 'FOR SALE' || st === 'ACTIVE') {
        where.status = 'ACTIVE';
      } else if (st === 'PENDING') {
        where.status = 'PENDING';
      } else if (st === 'SOLD') {
        where.status = 'SOLD';
      } else if (st === 'LEASED') {
        where.status = 'LEASED';
      } else {
        where.status = st;
      }
    } else {
      where.status = 'ACTIVE';
    }

    // 2. City Filter
    if (params.city && params.city !== 'All' && params.city !== 'Any') {
      where.city = { contains: params.city };
    }

    // 3. Property Type Normalization and Mapping
    const typeMapping: Record<string, string> = {
      'detached': 'DETACHED',
      'semi': 'SEMI_DETACHED',
      'semi-detached': 'SEMI_DETACHED',
      'townhouse': 'TOWNHOUSE',
      'condo': 'CONDO_APARTMENT',
      'condo apartment': 'CONDO_APARTMENT',
      'bungalow': 'BUNGALOW',
      'commercial': 'COMMERCIAL',
      'land': 'LAND'
    };

    const rawType = params.propertyType || params.homeType || params.propertyClass || params.category;
    if (rawType && rawType !== 'All' && rawType !== 'Any') {
      const normalized = String(rawType).toLowerCase().trim();
      const mapped = typeMapping[normalized];
      if (mapped) {
        where.propertyType = mapped;
      } else {
        where.propertyType = { contains: rawType };
      }
    }

    // 4. Bedrooms / Beds Filter
    const rawBeds = params.bedrooms ?? params.beds;
    if (rawBeds !== undefined && rawBeds !== null && rawBeds !== 'All' && rawBeds !== 'Any') {
      const bedsNum = parseInt(String(rawBeds).replace(/[^\d]/g, ''), 10);
      if (!isNaN(bedsNum)) {
        where.bedrooms = { gte: bedsNum };
      }
    }

    // 5. Bathrooms / Baths Filter
    const rawBaths = params.bathrooms ?? params.baths;
    if (rawBaths !== undefined && rawBaths !== null && rawBaths !== 'All' && rawBaths !== 'Any') {
      const bathsNum = parseFloat(String(rawBaths).replace(/[^\d.]/g, ''));
      if (!isNaN(bathsNum)) {
        where.bathrooms = { gte: bathsNum };
      }
    }

    // 6. Price Range Filters
    const minP = params.minPrice ?? params.min_price;
    const maxP = params.maxPrice ?? params.max_price;
    if (minP !== undefined || maxP !== undefined) {
      where.price = {};
      if (minP !== undefined && minP !== null && !isNaN(parseFloat(String(minP)))) {
        where.price.gte = parseFloat(String(minP));
      }
      if (maxP !== undefined && maxP !== null && !isNaN(parseFloat(String(maxP))) && parseFloat(String(maxP)) < 50000000) {
        where.price.lte = parseFloat(String(maxP));
      }
    }

    // 7. Square Footage Range Filters
    if (params.sqftMin !== undefined || params.sqftMax !== undefined) {
      where.squareFeet = {};
      if (params.sqftMin !== undefined && params.sqftMin !== null) {
        where.squareFeet.gte = parseInt(String(params.sqftMin), 10);
      }
      if (params.sqftMax !== undefined && params.sqftMax !== null && parseInt(String(params.sqftMax), 10) < 99999) {
        where.squareFeet.lte = parseInt(String(params.sqftMax), 10);
      }
    }

    // 8. Days On Market Filter
    if (params.daysOnMarket && params.daysOnMarket !== 'Any') {
      const days = parseInt(String(params.daysOnMarket).replace(/[^\d]/g, ''), 10);
      if (!isNaN(days)) {
        where.daysOnMarket = { lte: days };
      }
    }

    // 9. Show Only Multi-select Badge Filter
    const showOnlyTags = Array.isArray(params.showOnly)
      ? params.showOnly
      : (typeof params.showOnly === 'string' ? params.showOnly.split(',').filter(Boolean) : []);

    if (showOnlyTags.length > 0) {
      const andConditions: any[] = [];
      showOnlyTags.forEach((tag: string) => {
        const crit = tag.trim().toLowerCase();
        if (crit === 'open house') {
          andConditions.push({ virtualTour360Url: { not: null } });
        } else if (crit === 'new listings') {
          andConditions.push({ daysOnMarket: { lte: 7 } });
        } else if (crit === 'price reduced') {
          andConditions.push({ priceHistory: { some: { event: 'Price Drop' } } });
        } else if (crit === 'waterfront') {
          andConditions.push({
            OR: [
              { lifestyleTags: { contains: 'Waterfront' } },
              { title: { contains: 'Waterfront' } },
              { features: { some: { featureName: { contains: 'Waterfront' } } } }
            ]
          });
        } else if (crit === 'luxury') {
          andConditions.push({ price: { gte: 3000000 } });
        } else if (crit === 'swimming pool') {
          andConditions.push({ features: { some: { featureName: { contains: 'Pool' } } } });
        } else if (crit === 'garage') {
          andConditions.push({ features: { some: { featureName: { contains: 'Garage' } } } });
        } else if (crit === 'basement') {
          andConditions.push({ hasFinishedBasement: true });
        } else if (crit === 'pet friendly') {
          andConditions.push({ features: { some: { featureName: { contains: 'Pet' } } } });
        }
      });
      if (andConditions.length > 0) {
        where.AND = where.AND ? [...where.AND, ...andConditions] : andConditions;
      }
    }

    // 10. Keyword / General Text Search Filter
    const kw = params.keywords || params.search;
    if (kw && String(kw).trim().length > 0) {
      const term = String(kw).trim();
      const kwCondition = {
        OR: [
          { title: { contains: term } },
          { description: { contains: term } },
          { address: { contains: term } },
          { city: { contains: term } },
          { neighborhood: { contains: term } },
          { features: { some: { featureName: { contains: term } } } }
        ]
      };
      where.AND = where.AND ? [...where.AND, kwCondition] : [kwCondition];
    }

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip: params.skip || 0,
        take: params.take || 60,
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
