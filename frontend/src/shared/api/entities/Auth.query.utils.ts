import { AUTH_ERRORS } from '@shared/api';
import type { AuthErrorPayload } from './Auth.query.types';

export const parseAuthErrorPayload = async (
  response: Response,
): Promise<AuthErrorPayload | null> =>
  response.json().catch(() => null as AuthErrorPayload | null);

export const getUnauthorizedAuthError = (payload: AuthErrorPayload | null) =>
  payload?.error?.message === 'Email not verified'
    ? AUTH_ERRORS.EMAIL_NOT_VERIFIED
    : AUTH_ERRORS.UNAUTHORIZED;
