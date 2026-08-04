import { SearchRepository } from './search.repository.js';

export class SearchService {
  private searchRepo: SearchRepository;

  constructor() {
    this.searchRepo = new SearchRepository();
  }

  async search(query: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const { items, total } = await this.searchRepo.fullTextSearch(query, { skip, take: limit });

    return {
      results: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getCommunities() {
    return this.searchRepo.getCommunities();
  }
}
