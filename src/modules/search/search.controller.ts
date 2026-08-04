import { Request, Response, NextFunction } from 'express';
import { SearchService } from './search.service.js';
import { ResponseUtil } from '../../utils/response.util.js';

export class SearchController {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = (req.query.q as string) || '';
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const { results, meta } = await this.searchService.search(q, page, limit);
      return ResponseUtil.success(res, results, 'Search results retrieved', 200, meta);
    } catch (error) {
      next(error);
    }
  };

  getCommunities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const communities = await this.searchService.getCommunities();
      return ResponseUtil.success(res, communities, 'Communities retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
