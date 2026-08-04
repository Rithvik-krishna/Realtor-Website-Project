import { Request, Response, NextFunction } from 'express';
import { PropertyService } from './property.service.js';
import { ResponseUtil } from '../../utils/response.util.js';

export class PropertyController {
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  getProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { properties, meta } = await this.propertyService.getProperties(req.query);
      return ResponseUtil.success(res, properties, 'Properties retrieved successfully', 200, meta);
    } catch (error) {
      next(error);
    }
  };

  getPropertyDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const property = await this.propertyService.getPropertyDetails(req.params.identifier);
      return ResponseUtil.success(res, property, 'Property details retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  compareProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ids = (req.query.ids as string || '').split(',').filter(Boolean);
      const properties = await this.propertyService.compareProperties(ids);
      return ResponseUtil.success(res, properties, 'Property comparison retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  createProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const property = await this.propertyService.createProperty(req.body);
      return ResponseUtil.success(res, property, 'Property created successfully', 201);
    } catch (error) {
      next(error);
    }
  };
}
