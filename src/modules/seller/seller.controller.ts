import { Request, Response, NextFunction } from 'express';
import { SellerService } from './seller.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export class SellerController {
  private sellerService: SellerService;

  constructor() {
    this.sellerService = new SellerService();
  }

  requestValuation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const result = await this.sellerService.calculateHomeWorth({
        ...req.body,
        userId
      });
      return ResponseUtil.success(res, result, 'Home valuation calculated successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  getValuations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const valuations = await this.sellerService.getAllValuations();
      return ResponseUtil.success(res, valuations, 'Valuations retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
