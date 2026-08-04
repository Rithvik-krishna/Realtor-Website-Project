import { Request, Response, NextFunction } from 'express';
import { TRREBIntegrationService } from './trreb.service.js';
import { ResponseUtil } from '../../utils/response.util.js';

export class TRREBController {
  private trrebService: TRREBIntegrationService;

  constructor() {
    this.trrebService = new TRREBIntegrationService();
  }

  triggerSync = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const job = await this.trrebService.triggerManualSync();
      return ResponseUtil.success(res, job, 'TRREB MLS sync initiated and completed', 200);
    } catch (error) {
      next(error);
    }
  };
}
