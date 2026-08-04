import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors.js';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const issueMessages = error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join('; ');
        return next(new ValidationError(`Validation failed: ${issueMessages}`, error.issues));
      }
      next(error);
    }
  };
};
