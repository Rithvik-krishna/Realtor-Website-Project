import { SellerRepository } from './seller.repository.js';

export class SellerService {
  private sellerRepo: SellerRepository;

  constructor() {
    this.sellerRepo = new SellerRepository();
  }

  async calculateHomeWorth(data: {
    userId?: string;
    address: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    notes?: string;
  }) {
    // Valuation algorithm based on city baseline averages
    let basePrice = 850000;
    if (data.city.toLowerCase().includes('toronto')) basePrice = 1100000;
    if (data.city.toLowerCase().includes('brampton')) basePrice = 950000;

    const estimatedMin = Math.round(basePrice + (data.bedrooms * 80000) + (data.bathrooms * 40000) - 50000);
    const estimatedMax = Math.round(estimatedMin + 120000);

    const comparables = await this.sellerRepo.findComparables(data.city, data.bedrooms);

    const valuation = await this.sellerRepo.createValuationRequest({
      ...data,
      estimatedValueMin: estimatedMin,
      estimatedValueMax: estimatedMax
    });

    return {
      valuationId: valuation.id,
      address: data.address,
      estimatedMarketValue: {
        min: estimatedMin,
        max: estimatedMax,
        formattedRange: `$${estimatedMin.toLocaleString()} - $${estimatedMax.toLocaleString()}`
      },
      comparableProperties: comparables,
      localMarketTrends: {
        averageSellingTimeDays: 18,
        demandScore: 8.7,
        suggestedListingPrice: Math.round((estimatedMin + estimatedMax) / 2)
      }
    };
  }

  async getAllValuations() {
    return this.sellerRepo.getAllValuations();
  }
}
