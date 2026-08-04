import { prisma } from '../../database/client.js';

export class AnalyticsService {
  async getMarketStatistics(region = 'GTA') {
    const stat = await prisma.marketStatistic.findFirst({
      where: { region: { contains: region } },
      orderBy: { createdAt: 'desc' }
    });

    if (stat) return stat;

    // Fallback/Default Canadian market stats if database hasn't been seeded yet
    return {
      region,
      avgSellingPrice: 1085000,
      homesSoldThisWeek: 142,
      avgDaysOnMarket: 16,
      priceAppreciation: 4.8,
      marketType: 'BALANCED',
      buyerVsSellerMarket: 'Slight Seller Advantage',
      interestRate: 4.79
    };
  }
}
