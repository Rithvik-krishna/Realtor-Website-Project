import { BuyerRepository } from './buyer.repository.js';

export class BuyerService {
  private buyerRepo: BuyerRepository;

  constructor() {
    this.buyerRepo = new BuyerRepository();
  }

  async getSavedProperties(userId: string) {
    return this.buyerRepo.getSavedProperties(userId);
  }

  async saveProperty(userId: string, propertyId: string) {
    return this.buyerRepo.saveProperty(userId, propertyId);
  }

  async removeSavedProperty(userId: string, propertyId: string) {
    return this.buyerRepo.removeSavedProperty(userId, propertyId);
  }

  async getSavedSearches(userId: string) {
    return this.buyerRepo.getSavedSearches(userId);
  }

  async saveSearch(userId: string, title: string, filters: any) {
    const filtersJson = typeof filters === 'string' ? filters : JSON.stringify(filters);
    return this.buyerRepo.saveSearch(userId, title, filtersJson);
  }
}
