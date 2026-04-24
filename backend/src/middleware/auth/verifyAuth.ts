import { verifyAccessToken } from '@utils';
import { UnauthorizedError } from '@errors';

export const verifyAuth = (authHeader: string | undefined): number => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    throw new UnauthorizedError('Invalid access token');
  }

  return payload.userId;
};
