import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { ResponseUtil } from '../utils/response.util.js';
import { Logger } from '../utils/logger.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error(`API Error: ${err.message}`, { stack: err.stack });

  if (err instanceof AppError) {
    return ResponseUtil.error(res, err.message, err.statusCode, err.errors);
  }

  return ResponseUtil.error(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    500
  );
};
