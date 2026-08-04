import { prisma } from '../../database/client.js';
import { Logger } from '../../utils/logger.js';

export class TRREBIntegrationService {
  async triggerManualSync() {
    Logger.info('Starting manual TRREB / MLS data sync...');

    const syncJob = await prisma.syncJob.create({
      data: {
        source: 'TRREB_MLS',
        status: 'IN_PROGRESS'
      }
    });

    try {
      // Mock fetching TRREB feed batch, normalizing, and syncing into database
      const mockRawListings = [
        {
          mlsId: `W${Math.floor(1000000 + Math.random() * 9000000)}`,
          title: 'Modern Detached Home in Brampton Springdale',
          description: 'Spacious 4 bedroom detached home with finished basement and double garage.',
          price: 1149000,
          bedrooms: 4,
          bathrooms: 3.5,
          address: '45 Bramalea Road',
          city: 'Brampton',
          postalCode: 'L6T 2W4',
          propertyType: 'DETACHED',
          lifestyleTags: 'Family Friendly, Near Transit'
        }
      ];

      let syncedCount = 0;
      for (const listing of mockRawListings) {
        const slug = `${listing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${listing.mlsId}`;
        await prisma.property.upsert({
          where: { mlsId: listing.mlsId },
          create: {
            mlsId: listing.mlsId,
            title: listing.title,
            slug,
            description: listing.description,
            price: listing.price,
            bedrooms: listing.bedrooms,
            bathrooms: listing.bathrooms,
            address: listing.address,
            city: listing.city,
            postalCode: listing.postalCode,
            propertyType: listing.propertyType as any,
            lifestyleTags: listing.lifestyleTags
          },
          update: {
            price: listing.price,
            updatedAt: new Date()
          }
        });
        syncedCount++;
      }

      const completedJob = await prisma.syncJob.update({
        where: { id: syncJob.id },
        data: {
          status: 'COMPLETED',
          recordsSynced: syncedCount,
          completedAt: new Date()
        }
      });

      Logger.info(`TRREB MLS sync completed. Synced ${syncedCount} records.`);
      return completedJob;
    } catch (error: any) {
      await prisma.syncJob.update({
        where: { id: syncJob.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          completedAt: new Date()
        }
      });
      throw error;
    }
  }
}
