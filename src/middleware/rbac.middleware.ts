import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

export const requireRoles = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    const hasRole = req.user.roles.some((role) => roles.includes(role));
    if (!hasRole) {
      return next(
        new ForbiddenError(
          `Action requires one of the following roles: ${roles.join(', ')}`
        )
      );
    }

    next();
  };
};
