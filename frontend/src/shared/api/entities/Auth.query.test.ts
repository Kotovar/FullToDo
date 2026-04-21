import { AUTH_ERRORS } from '@shared/api';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '@shared/api/auth';
import { authService } from './Auth.query';
import type {
  LoginWithEmail,
  LoginWithGoogle,
  PublicUser,
  RegisterWithEmail,
} from 'shared/schemas';

const loginCredentials: LoginWithEmail = {
  email: 'user@example.com',
  password: 'Password1',
};

const registerCredentials: RegisterWithEmail = {
  email: 'user@example.com',
  password: 'Password1',
};

const googleCredentials: LoginWithGoogle = {
  token: 'google-token',
};

const user: PublicUser = {
  userId: 1,
  email: 'user@example.com',
  isVerified: true,
};

const createJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

describe('AuthService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearAccessToken();
  });

  test('register sends request with credentials include and without Authorization header', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(createJsonResponse({ user }, 201));

    const result = await authService.register(registerCredentials);

    const [, init] = fetchSpy.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);

    expect(result).toEqual({ user });
    expect(init?.credentials).toBe('include');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBeNull();
  });

  test('login stores access token after successful response', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      createJsonResponse({
        message: 'Successful login',
        accessToken: 'access-token-1',
      }),
    );

    const result = await authService.login(loginCredentials);

    const [, init] = fetchSpy.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);

    expect(result.accessToken).toBe('access-token-1');
    expect(getAccessToken()).toBe('access-token-1');
    expect(init?.credentials).toBe('include');
    expect(headers.get('Authorization')).toBeNull();
  });

  test('me sends Bearer token when access token exists', async () => {
    setAccessToken('access-token-2');
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(createJsonResponse({ user }));

    const result = await authService.me();

    const [, init] = fetchSpy.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);

    expect(result).toEqual({ user });
    expect(init?.credentials).toBe('include');
    expect(headers.get('Authorization')).toBe('Bearer access-token-2');
  });

  test('google login stores access token after successful response', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      createJsonResponse({
        message: 'Successful login',
        accessToken: 'google-access-token',
      }),
    );

    const result = await authService.loginWithGoogle(googleCredentials);

    const [, init] = fetchSpy.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);

    expect(result.accessToken).toBe('google-access-token');
    expect(getAccessToken()).toBe('google-access-token');
    expect(init?.credentials).toBe('include');
    expect(headers.get('Authorization')).toBeNull();
  });

  test('refresh replaces access token', async () => {
    setAccessToken('stale-token');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      createJsonResponse({
        message: 'Successful refresh',
        accessToken: 'fresh-token',
      }),
    );

    const result = await authService.refresh();

    const [, init] = fetchSpy.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);

    expect(result.accessToken).toBe('fresh-token');
    expect(getAccessToken()).toBe('fresh-token');
    expect(init?.credentials).toBe('include');
    expect(headers.get('Authorization')).toBeNull();
  });

  test('logout clears access token', async () => {
    setAccessToken('access-token-3');
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        createJsonResponse({ message: 'Successful logout' }),
      );

    const result = await authService.logout();

    const [, init] = fetchSpy.mock.calls[0] ?? [];

    expect(result.message).toBe('Successful logout');
    expect(getAccessToken()).toBeNull();
    expect(init?.credentials).toBe('include');
  });

  test('verifyEmail sends request without Authorization header', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        createJsonResponse({ message: 'Email verified successfully' }),
      );

    const result = await authService.verifyEmail('token-123');

    const [url, init] = fetchSpy.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);

    expect(String(url)).toContain('/auth/verify-email?token=token-123');
    expect(result.message).toBe('Email verified successfully');
    expect(init?.credentials).toBe('include');
    expect(headers.get('Authorization')).toBeNull();
  });

  test('returns unauthorized error details for 401 responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      createJsonResponse({ message: 'Invalid credentials' }, 401),
    );

    await expect(authService.me()).rejects.toThrow(
      expect.objectContaining({
        message: 'Unauthorized',
        cause: AUTH_ERRORS.UNAUTHORIZED,
      }),
    );
  });

  test('returns email not verified error details for auth verify case', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      createJsonResponse(
        { error: { statusCode: 401, message: 'Email not verified' } },
        401,
      ),
    );

    await expect(authService.login(loginCredentials)).rejects.toThrow(
      expect.objectContaining({
        message: 'Unauthorized',
        cause: AUTH_ERRORS.EMAIL_NOT_VERIFIED,
      }),
    );
  });

  test('returns network error details when fetch fails without cause', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new Error('Failed to fetch'),
    );

    await expect(authService.login(loginCredentials)).rejects.toThrow(
      expect.objectContaining({
        message: 'Network error',
        cause: AUTH_ERRORS.NETWORK_ERROR,
      }),
    );
  });
});
