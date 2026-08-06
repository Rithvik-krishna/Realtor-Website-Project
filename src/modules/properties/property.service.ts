import { PropertyRepository } from './property.repository.js';
import { CreatePropertyDto } from './property.validator.js';
import { NotFoundError } from '../../utils/errors.js';
import { trrebService } from '../../services/trrebService.js';

export class PropertyService {
  private propertyRepo: PropertyRepository;

  constructor() {
    this.propertyRepo = new PropertyRepository();
  }

  async getProperties(query: any) {
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.limit as string, 10) || 100;
    const skip = (page - 1) * limit;

    let trrebProperties: any[] = [];
    let totalCount = 0;

    try {
      // Fetch live listings from TRREB OData API
      const trrebResult = await trrebService.getProperties({
        city: query.city as string,
        top: limit,
        skip: skip,
        filter: query.filter as string
      });

      trrebProperties = trrebResult.properties || [];
      totalCount = trrebResult.count || trrebProperties.length;
    } catch (err) {
      console.warn('⚠️ live TRREB property fetch failed, falling back to database:', err);
    }

    // Deduplicate by MLS Number / ListingKey
    const seen = new Set<string>();
    const uniqueProperties = trrebProperties.filter((p: any) => {
      const key = p.mlsNumber || p.id || p.listingKey;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    let finalProperties = uniqueProperties;

    // Local DB Fallback: if TRREB is unconfigured / unauthenticated or empty, use database
    if (finalProperties.length === 0) {
      console.log('📡 [PropertyService] Falling back to local SQLite database!');
      const dbResult = await this.propertyRepo.findAll({
        skip,
        take: limit,
        ...query
      });

      finalProperties = dbResult.items.map(p => this.mapDbProperty(p));
      totalCount = dbResult.total;
    }

    return {
      properties: finalProperties,
      meta: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  private mapDbProperty(p: any): any {
    const primaryImg = p.images?.find((img: any) => img.isPrimary) || p.images?.[0];
    const imageUrl = primaryImg ? primaryImg.url : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
    const images = p.images?.map((img: any) => img.url) || [imageUrl];
    const features = p.features?.map((f: any) => f.featureName) || [];

    let mappedType = p.propertyType || 'Detached';
    if (mappedType === 'DETACHED') mappedType = 'Detached';
    else if (mappedType === 'SEMI_DETACHED') mappedType = 'Semi-Detached';
    else if (mappedType === 'TOWNHOUSE') mappedType = 'Townhouse';
    else if (mappedType === 'CONDO_APARTMENT') mappedType = 'Condo';

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: p.price,
      previousPrice: p.price * 1.05,
      priceDrop: 0,
      location: p.neighborhood || p.city,
      city: p.city,
      province: p.province || 'ON',
      postalCode: p.postalCode,
      mlsNumber: p.mlsId || p.id,
      beds: p.bedrooms,
      baths: p.bathrooms,
      sqft: p.squareFeet || 1500,
      lotSize: p.lotAreaSqFt || 0,
      propertyTax: p.propertyTax || 4000,
      yearBuilt: p.yearBuilt || 2018,
      walkScore: p.walkScore || 75,
      transitScore: p.transitScore || 75,
      schoolScore: p.schoolRating || 8.0,
      energyRating: 85,
      propertyStatus: p.status || 'Active',
      daysOnMarket: p.daysOnMarket || 5,
      propertyType: mappedType,
      estateClassification: p.estateClassification || 'Residential',
      luxuryBadge: p.price >= 3000000,
      openHouse: p.virtualTour360Url ? 'Sat & Sun 2-4 PM' : null,
      virtualTour: p.virtualTour360Url ? true : false,
      virtualTourUrl: p.virtualTour360Url,
      droneTour: p.droneVideoUrl ? true : false,
      droneVideoUrl: p.droneVideoUrl,
      featured: p.isFeatured || false,
      recentlyAdded: true,
      aiRecommended: false,
      imageUrl,
      images,
      category: p.propertyType === 'CONDO_APARTMENT' ? 'Condo' : 'Residential',
      monthlyHOA: p.hoaFee || 0,
      taxes: p.propertyTax || 4000,
      features,
      basement: p.hasFinishedBasement ? 'Finished' : 'None',
      garage: 'Attached',
      crimeRate: 'Low',
      hospitalRating: 'Excellent',
      lat: p.latitude || 43.6532,
      lng: p.longitude || -79.3832,
      address: p.address,
      typology: mappedType,
      amenities: features,
      floorPlanUrl: p.floorPlanUrl,
      videoUrl: p.droneVideoUrl
    };
  }

  async getPropertyDetails(identifier: string) {
    const trrebProperty = await trrebService.getPropertyByKey(identifier);
    if (trrebProperty) {
      return trrebProperty;
    }

    const property = await this.propertyRepo.findByIdOrSlug(identifier);
    if (!property) {
      throw new NotFoundError(`Property with identifier '${identifier}' not found`);
    }
    return this.mapDbProperty(property);
  }

  async compareProperties(propertyIds: string[]) {
    return this.propertyRepo.findByIds(propertyIds);
  }

  async createProperty(dto: CreatePropertyDto) {
    return this.propertyRepo.createProperty(dto);
  }
}
