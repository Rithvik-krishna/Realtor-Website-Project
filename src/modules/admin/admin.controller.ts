import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service.js';
import { ResponseUtil } from '../../utils/response.util.js';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.adminService.getDashboardStats();
      return ResponseUtil.success(res, stats, 'Admin dashboard statistics retrieved', 200);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.adminService.getAllUsers();
      return ResponseUtil.success(res, users, 'All users retrieved', 200);
    } catch (error) {
      next(error);
    }
  };

  getSyncLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.adminService.getSyncLogs();
      return ResponseUtil.success(res, logs, 'Sync logs retrieved', 200);
    } catch (error) {
      next(error);
    }
  };
}
