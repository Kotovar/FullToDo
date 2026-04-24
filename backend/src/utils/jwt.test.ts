import { describe, test, expect } from 'vitest';
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailToken,
  verifyAccessToken,
  verifyRefreshToken,
  isAccessTokenPayload,
  isRefreshTokenPayload,
} from './jwt';

const USER_ID = 42;

describe('generateAccessToken / verifyAccessToken', () => {
  test('verifyAccessToken returns payload with correct userId and type', () => {
    const token = generateAccessToken(USER_ID);
    const payload = verifyAccessToken(token);

    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe(USER_ID);
    expect(payload?.type).toBe('access');
  });

  test('verifyAccessToken returns null for invalid token', () => {
    expect(verifyAccessToken('invalid.token.here')).toBeNull();
  });

  test('verifyAccessToken returns null for refresh token', () => {
    const refreshToken = generateRefreshToken(USER_ID);
    expect(verifyAccessToken(refreshToken)).toBeNull();
  });
});

describe('generateRefreshToken / verifyRefreshToken', () => {
  test('verifyRefreshToken returns payload with correct userId and type', () => {
    const token = generateRefreshToken(USER_ID);
    const payload = verifyRefreshToken(token);

    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe(USER_ID);
    expect(payload?.type).toBe('refresh');
  });

  test('verifyRefreshToken returns null for invalid token', () => {
    expect(verifyRefreshToken('invalid.token.here')).toBeNull();
  });

  test('verifyRefreshToken returns null for access token', () => {
    const accessToken = generateAccessToken(USER_ID);
    expect(verifyRefreshToken(accessToken)).toBeNull();
  });
});

describe('generateEmailToken', () => {
  test('returns a non-empty string', () => {
    const token = generateEmailToken(USER_ID);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });
});

describe('isAccessTokenPayload', () => {
  test('returns true for valid access payload', () => {
    expect(isAccessTokenPayload({ userId: 1, type: 'access' })).toBe(true);
  });

  test('returns false for refresh payload', () => {
    expect(isAccessTokenPayload({ userId: 1, type: 'refresh' })).toBe(false);
  });

  test('returns false for missing fields', () => {
    expect(isAccessTokenPayload({ userId: 1 })).toBe(false);
    expect(isAccessTokenPayload({ type: 'access' })).toBe(false);
    expect(isAccessTokenPayload(null)).toBe(false);
  });
});

describe('isRefreshTokenPayload', () => {
  test('returns true for valid refresh payload', () => {
    expect(isRefreshTokenPayload({ userId: 1, type: 'refresh' })).toBe(true);
  });

  test('returns false for access payload', () => {
    expect(isRefreshTokenPayload({ userId: 1, type: 'access' })).toBe(false);
  });
});
