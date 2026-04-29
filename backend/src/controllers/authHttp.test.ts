import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'http';
import { refresh } from './authHttp';
import { TooManyRequestsError, UnauthorizedError } from '@errors';
import type { AuthService } from '@services/AuthService';

const { httpRateLimitMock } = vi.hoisted(() => ({
  httpRateLimitMock: vi.fn(),
}));

vi.mock('@middleware', () => ({
  httpAuthMiddleware: vi.fn(),
  httpRateLimit: httpRateLimitMock,
}));

const createResponse = () => {
  const res = {
    writeHead: vi.fn(),
    end: vi.fn(),
  } as unknown as ServerResponse;

  vi.mocked(res.writeHead).mockReturnValue(res);

  return res;
};

const createRequest = (cookie?: string) =>
  ({
    headers: cookie ? { cookie } : {},
  }) as IncomingMessage;

describe('authHttp refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('does not check failed refresh limit before a successful refresh', async () => {
    const req = createRequest('refreshToken=old-refresh-token');
    const res = createResponse();
    const service = {
      refresh: vi.fn().mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }),
    } as unknown as AuthService;

    httpRateLimitMock.mockRejectedValue(new TooManyRequestsError());

    await refresh({ req, res }, service);

    expect(httpRateLimitMock).not.toHaveBeenCalled();
    expect(service.refresh).toHaveBeenCalledWith('old-refresh-token');
    expect(res.writeHead).toHaveBeenCalledWith(
      200,
      expect.objectContaining({
        'Set-Cookie': expect.stringContaining('refreshToken=new-refresh-token'),
      }),
    );
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        message: 'Successful refresh',
        accessToken: 'new-access-token',
      }),
    );
  });

  test('does not consume failed refresh limit when refresh cookie is missing', async () => {
    const req = createRequest();
    const res = createResponse();
    const service = {
      refresh: vi.fn(),
    } as unknown as AuthService;

    await refresh({ req, res }, service);

    expect(service.refresh).not.toHaveBeenCalled();
    expect(httpRateLimitMock).not.toHaveBeenCalled();
    expect(res.writeHead).toHaveBeenCalledWith(401, {
      'Content-Type': 'application/json',
    });
  });

  test('consumes failed refresh limit for an invalid refresh token', async () => {
    const req = createRequest('refreshToken=invalid-refresh-token');
    const res = createResponse();
    const service = {
      refresh: vi
        .fn()
        .mockRejectedValue(new UnauthorizedError('Invalid refresh token')),
    } as unknown as AuthService;

    await refresh({ req, res }, service);

    expect(httpRateLimitMock).toHaveBeenCalledWith(
      { req, res },
      {
        keyPrefix: 'auth:refresh:failed',
        maxRequests: 5,
        windowSeconds: 10 * 60,
      },
    );
    expect(res.writeHead).toHaveBeenCalledWith(401, {
      'Content-Type': 'application/json',
    });
  });
});
