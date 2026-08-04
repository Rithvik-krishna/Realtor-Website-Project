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
    const limit = parseInt(query.limit as string, 10) || 60;
    const skip = (page - 1) * limit;

    // Fetch ONLY live authenticated listings from TRREB OData API (Zero mock/db seed mixing)
    const trrebResult = await trrebService.getProperties({
      city: query.city as string,
      top: limit,
      skip: skip,
      filter: query.filter as string
    });

    const trrebProperties = trrebResult.properties || [];

    // Deduplicate by MLS Number / ListingKey
    const seen = new Set<string>();
    const uniqueProperties = trrebProperties.filter((p: any) => {
      const key = p.mlsNumber || p.id || p.listingKey;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const totalCount = trrebResult.count || trrebProperties.length;

    return {
      properties: uniqueProperties,
      meta: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
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
    return property;
  }

  async compareProperties(propertyIds: string[]) {
    return this.propertyRepo.findByIds(propertyIds);
  }

  async createProperty(dto: CreatePropertyDto) {
    return this.propertyRepo.createProperty(dto);
  }
}
