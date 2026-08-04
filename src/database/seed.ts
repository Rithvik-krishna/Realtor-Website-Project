import { prisma } from './client.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database with Canadian Realtor initial data...');

  // 1. Roles
  const roles = ['GUEST', 'BUYER', 'SELLER', 'AGENT', 'ADMIN', 'SUPER_ADMIN'];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name: name as any },
      create: { name: name as any, description: `${name} role` },
      update: {}
    });
  }

  // 2. Admin User
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Admin@12345', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@yugaai-realty.ca' },
    create: {
      email: 'admin@yugaai-realty.ca',
      passwordHash,
      firstName: 'Nikhil',
      lastName: 'Reddy',
      phone: '+14165550199',
      isEmailVerified: true
    },
    update: {}
  });

  if (adminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
      create: { userId: admin.id, roleId: adminRole.id },
      update: {}
    });
  }

  // 3. Communities (Brampton, Toronto)
  const brampton = await prisma.community.upsert({
    where: { slug: 'brampton' },
    create: {
      name: 'Brampton',
      slug: 'brampton',
      city: 'Brampton',
      province: 'ON',
      description: 'Vibrant family-oriented suburban hub in the GTA with top schools and green spaces.',
      avgPrice: 1050000,
      crimeRateScore: 2.1,
      schoolRating: 8.9,
      transitScore: 78,
      isFeatured: true
    },
    update: {}
  });

  const toronto = await prisma.community.upsert({
    where: { slug: 'downtown-toronto' },
    create: {
      name: 'Downtown Toronto',
      slug: 'downtown-toronto',
      city: 'Toronto',
      province: 'ON',
      description: 'The financial heart of Canada featuring luxury high-rises and world-class amenities.',
      avgPrice: 1350000,
      crimeRateScore: 3.2,
      schoolRating: 9.1,
      transitScore: 98,
      isFeatured: true
    },
    update: {}
  });

  // 4. Sample Canadian Properties
  const properties = [
    {
      mlsId: 'W8019284',
      title: 'Luxury Executive Detached Home in Brampton',
      slug: 'luxury-executive-detached-home-in-brampton-w8019284',
      description: 'Stunning 4+2 bedroom detached home featuring 9ft ceilings, open-concept layout, finished basement apartment, and custom quartz kitchen.',
      price: 1289000,
      propertyType: 'DETACHED' as const,
      status: 'ACTIVE' as const,
      bedrooms: 4,
      bathrooms: 4,
      squareFeet: 3200,
      address: '18 Creditview Road',
      city: 'Brampton',
      postalCode: 'L6Y 0G4',
      communityId: brampton.id,
      walkScore: 72,
      transitScore: 81,
      schoolRating: 9.0,
      hasFinishedBasement: true,
      isFeatured: true,
      lifestyleTags: 'Family Friendly, Quiet Neighborhood',
      virtualTour360Url: 'https://example.com/360/brampton-18',
      images: [
        { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
      ]
    },
    {
      mlsId: 'C7019231',
      title: 'Penthouse Condo with Panoramic CN Tower Views',
      slug: 'penthouse-condo-with-panoramic-cn-tower-views-c7019231',
      description: 'Exquisite 2 bedroom penthouse in downtown Toronto. Floor-to-ceiling windows, 10ft ceilings, wrap-around terrace, direct subway access.',
      price: 899000,
      propertyType: 'CONDO_APARTMENT' as const,
      status: 'ACTIVE' as const,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1100,
      address: '88 Harbour Street',
      city: 'Toronto',
      postalCode: 'M5J 0B7',
      communityId: toronto.id,
      walkScore: 99,
      transitScore: 100,
      schoolRating: 8.7,
      hasFinishedBasement: false,
      isFeatured: true,
      lifestyleTags: 'Downtown Living, Waterfront, Near Transit',
      virtualTour360Url: 'https://example.com/360/toronto-88',
      images: [
        { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', isPrimary: true }
      ]
    }
  ];

  for (const p of properties) {
    const images = p.images;
    const pData: any = { ...p };
    delete pData.images;

    await prisma.property.upsert({
      where: { mlsId: p.mlsId },
      create: {
        ...pData,
        images: { create: images }
      },
      update: {}
    });
  }

  // 5. Market Statistics Initial Seed
  await prisma.marketStatistic.create({
    data: {
      region: 'GTA',
      avgSellingPrice: 1120000,
      homesSoldThisWeek: 210,
      avgDaysOnMarket: 14,
      priceAppreciation: 5.2,
      marketType: 'BALANCED'
    }
  });

  console.log('Seeding completed successfully!');
}

seed()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
