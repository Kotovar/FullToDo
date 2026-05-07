import { describe, expect, test } from 'vitest';
import type { ExecutionContext } from '@nestjs/common';
import { USER_ID } from '@sharedCommon/schemas';
import { generateAccessToken } from '@utils';
import { AuthGuard } from './auth.guard';
import type { AuthenticatedNestRequest } from './authenticated-request';

const createHttpContext = (
  request: Partial<AuthenticatedNestRequest>,
): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  }) as ExecutionContext;

describe('AuthGuard', () => {
  test('should attach userId from bearer token', () => {
    const request: Partial<AuthenticatedNestRequest> = {
      headers: {
        authorization: `Bearer ${generateAccessToken(USER_ID)}`,
      },
    };

    const result = new AuthGuard().canActivate(createHttpContext(request));

    expect(result).toBe(true);
    expect(request.userId).toBe(USER_ID);
  });

  test('should throw for missing auth header', () => {
    const request: Partial<AuthenticatedNestRequest> = {
      headers: {},
    };

    expect(() => new AuthGuard().canActivate(createHttpContext(request)))
      .toThrow('Unauthorized');
  });
});
