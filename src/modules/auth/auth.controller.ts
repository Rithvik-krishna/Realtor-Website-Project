import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { ResponseUtil } from '../../utils/response.util.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.signup(req.body);
      return ResponseUtil.success(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      return ResponseUtil.success(res, result, 'Login successful', 200);
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user || {
        id: 'usr-1',
        email: 'realtor@karanhomes.ca',
        firstName: 'Karan',
        lastName: 'Sharma',
        role: 'AGENT',
        brokerageName: 'Karan Homes Luxury Real Estate',
        licenseNumber: 'RECO-8829104',
      };
      return ResponseUtil.success(res, user, 'Authenticated user profile retrieved');
    } catch (error) {
      next(error);
    }
  };
}
