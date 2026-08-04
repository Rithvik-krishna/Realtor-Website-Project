import { Response } from 'express';

export interface ApiResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: any;
}

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
    meta?: ApiResponseMeta
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta ? { meta } : {})
    });
  }

  static error(
    res: Response,
    message = 'An error occurred',
    statusCode = 500,
    errors: any = null
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors ? { errors } : {})
    });
  }
}
