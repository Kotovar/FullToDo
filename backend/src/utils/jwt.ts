import jsonwebtoken from 'jsonwebtoken';
import { config } from '@configs';

const JWT_ALGORITHM = 'HS256';
const EMAIL_TOKEN_EXPIRES_IN = '24h';
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

type JWT = 'access' | 'refresh' | 'email';
type TokenPayload = { userId: number; type: JWT };
type AccessTokenPayload = TokenPayload & { type: 'access' };
type RefreshTokenPayload = TokenPayload & { type: 'refresh' };
type EmailTokenPayload = TokenPayload & { type: 'email' };

const isTokenPayload = (payload: unknown): payload is TokenPayload =>
  typeof payload === 'object' &&
  payload !== null &&
  'userId' in payload &&
  'type' in payload &&
  typeof payload.userId === 'number';

export const isAccessTokenPayload = (
  payload: unknown,
): payload is AccessTokenPayload =>
  isTokenPayload(payload) && payload.type === 'access';

export const isRefreshTokenPayload = (
  payload: unknown,
): payload is RefreshTokenPayload =>
  isTokenPayload(payload) && payload.type === 'refresh';

export const isEmailTokenPayload = (
  payload: unknown,
): payload is EmailTokenPayload =>
  isTokenPayload(payload) && payload.type === 'email';

export const generateEmailToken = (userId: number) =>
  jsonwebtoken.sign({ userId, type: 'email' }, config.emailTokenSecret, {
    expiresIn: EMAIL_TOKEN_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
  });

export const generateAccessToken = (userId: number) =>
  jsonwebtoken.sign({ userId, type: 'access' }, config.accessTokenSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
  });

export const generateRefreshToken = (userId: number) =>
  jsonwebtoken.sign({ userId, type: 'refresh' }, config.refreshTokenSecret, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
  });

const verifyToken = <T>(
  token: string,
  secret: string,
  guard: (payload: unknown) => payload is T,
): T | null => {
  try {
    const payload = jsonwebtoken.verify(token, secret, {
      algorithms: [JWT_ALGORITHM],
    });

    return guard(payload) ? payload : null;
  } catch {
    return null;
  }
};

export const verifyAccessToken = (token: string) =>
  verifyToken(token, config.accessTokenSecret, isAccessTokenPayload);

export const verifyRefreshToken = (token: string) =>
  verifyToken(token, config.refreshTokenSecret, isRefreshTokenPayload);

export const verifyEmailToken = (token: string) =>
  verifyToken(token, config.emailTokenSecret, isEmailTokenPayload);
