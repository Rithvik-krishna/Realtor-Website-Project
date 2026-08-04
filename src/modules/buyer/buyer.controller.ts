import { Response, NextFunction } from 'express';
import { BuyerService } from './buyer.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export class BuyerController {
  private buyerService: BuyerService;

  constructor() {
    this.buyerService = new BuyerService();
  }

  getSavedProperties = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const items = await this.buyerService.getSavedProperties(req.user!.id);
      return ResponseUtil.success(res, items, 'Saved properties retrieved', 200);
    } catch (error) {
      next(error);
    }
  };

  saveProperty = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { propertyId } = req.body;
      const item = await this.buyerService.saveProperty(req.user!.id, propertyId);
      return ResponseUtil.success(res, item, 'Property saved to favorites', 201);
    } catch (error) {
      next(error);
    }
  };

  removeSavedProperty = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { propertyId } = req.params;
      await this.buyerService.removeSavedProperty(req.user!.id, propertyId);
      return ResponseUtil.success(res, null, 'Property removed from favorites', 200);
    } catch (error) {
      next(error);
    }
  };

  getSavedSearches = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const searches = await this.buyerService.getSavedSearches(req.user!.id);
      return ResponseUtil.success(res, searches, 'Saved searches retrieved', 200);
    } catch (error) {
      next(error);
    }
  };

  saveSearch = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { title, filters } = req.body;
      const item = await this.buyerService.saveSearch(req.user!.id, title, filters);
      return ResponseUtil.success(res, item, 'Search criteria saved', 201);
    } catch (error) {
      next(error);
    }
  };
}
