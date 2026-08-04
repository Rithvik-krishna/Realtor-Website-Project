import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service.js';
import { ResponseUtil } from '../../utils/response.util.js';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  getMarketDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const region = (req.query.region as string) || 'GTA';
      const stats = await this.analyticsService.getMarketStatistics(region);
      return ResponseUtil.success(res, stats, 'Live market statistics retrieved', 200);
    } catch (error) {
      next(error);
    }
  };
}
