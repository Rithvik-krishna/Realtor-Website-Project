import { Request, Response, NextFunction } from 'express';
import { trrebService } from '../services/trrebService.js';

export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city, top, skip, sort, orderby, filter } = req.query;

    const options = {
      city: typeof city === 'string' ? city : undefined,
      top: top ? parseInt(top as string, 10) : 20,
      skip: skip ? parseInt(skip as string, 10) : 0,
      orderby: typeof orderby === 'string' ? orderby : (typeof sort === 'string' && sort === 'price_desc' ? 'ListPrice desc' : undefined),
      filter: typeof filter === 'string' ? filter : undefined
    };

    const result = await trrebService.getProperties(options);

    res.status(200).json({
      success: true,
      count: result.properties.length,
      nextLink: result.nextLink,
      data: result.properties
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const property = await trrebService.getPropertyByKey(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property with key '${id}' not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

export const searchProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city } = req.query;
    const cityName = typeof city === 'string' ? city : 'Toronto';
    const properties = await trrebService.searchByCity(cityName);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await trrebService.getProperties({ top: 12 });
    res.status(200).json({
      success: true,
      count: result.properties.length,
      data: result.properties
    });
  } catch (error) {
    next(error);
  }
};
