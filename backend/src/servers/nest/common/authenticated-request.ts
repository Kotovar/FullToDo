import type { Request } from 'express';

/**
 * Express-запрос после прохождения Nest AuthGuard.
 *
 * `userId` добавляется только guard-ом на основании JWT, поэтому Nest
 * controllers не должны брать пользователя из body/query/params.
 */
export type AuthenticatedNestRequest = Request & {
  userId: number;
};
