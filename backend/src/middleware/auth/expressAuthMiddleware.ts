import type { RequestHandler } from 'express';
import { verifyAuth } from '@middleware/auth/verifyAuth';

declare module 'express-serve-static-core' {
  interface Request {
    userId: number;
  }
}

export const expressAuthMiddleware: RequestHandler = (req, _res, next) => {
  try {
    req.userId = verifyAuth(req.headers.authorization);
    next();
  } catch (error) {
    next(error);
  }
};
