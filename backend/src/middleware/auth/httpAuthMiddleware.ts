import { verifyAuth } from './verifyAuth';
import type { HttpContext } from '@controllers/types';

export type AuthContext = HttpContext & { userId: number };

export const httpAuthMiddleware = (ctx: HttpContext): AuthContext => {
  const userId = verifyAuth(ctx.req.headers.authorization);

  return { ...ctx, userId };
};
