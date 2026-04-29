import {
  checkContentType,
  errorHandler,
  getAccountRateLimitKey,
  handleValidationError,
  parseJsonBody,
} from './utils';
import {
  changePasswordSchema,
  deleteUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@sharedCommon/schemas';
import { httpAuthMiddleware, httpRateLimit } from '@middleware';
import type { ServiceHandler } from './types';
import type { AuthService } from '@services/AuthService';

export const changePassword: ServiceHandler<AuthService> = async (
  ctx,
  service,
) => {
  const { req, res } = ctx;
  try {
    if (!checkContentType(req, res)) return;

    const { userId } = httpAuthMiddleware(ctx);

    await httpRateLimit(ctx, {
      keyPrefix: `auth:change-password:user:${userId}`,
      maxRequests: 5,
      windowSeconds: 10 * 60,
    });

    const raw = await parseJsonBody(req);
    const validation = changePasswordSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    const { oldPassword, newPassword } = validation.data;

    await service.changePassword(userId, oldPassword, newPassword);

    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Password changed successfully' }));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const forgotPassword: ServiceHandler<AuthService> = async (
  ctx,
  service,
) => {
  const { req, res } = ctx;
  try {
    await httpRateLimit(ctx, {
      keyPrefix: 'auth:forgot-password:ip',
      maxRequests: 5,
      windowSeconds: 10 * 60,
    });

    if (!checkContentType(req, res)) return;

    const raw = await parseJsonBody(req);
    const validation = forgotPasswordSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    const { email } = validation.data;

    await httpRateLimit(ctx, {
      keyPrefix: `auth:forgot-password:account:${getAccountRateLimitKey(
        email,
      )}`,
      maxRequests: 3,
      windowSeconds: 30 * 60,
    });

    await service.requestPasswordReset(email);

    res.writeHead(200, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        message: 'If the account exists, password reset instructions were sent',
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

export const resetPassword: ServiceHandler<AuthService> = async (
  ctx,
  service,
) => {
  const { req, res } = ctx;
  try {
    await httpRateLimit(ctx, {
      keyPrefix: 'auth:reset-password:ip',
      maxRequests: 10,
      windowSeconds: 10 * 60,
    });

    if (!checkContentType(req, res)) return;

    const raw = await parseJsonBody(req);
    const validation = resetPasswordSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    const { token, newPassword } = validation.data;

    await service.resetPassword(token, newPassword);

    res.writeHead(200, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        message: 'Password reset successful',
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteUser: ServiceHandler<AuthService> = async (ctx, service) => {
  const { req, res } = ctx;
  try {
    if (!checkContentType(req, res)) return;

    const { userId } = httpAuthMiddleware(ctx);

    await httpRateLimit(ctx, {
      keyPrefix: `auth:delete-user:user:${userId}`,
      maxRequests: 5,
      windowSeconds: 10 * 60,
    });

    const raw = await parseJsonBody(req);
    const validation = deleteUserSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    const { currentPassword } = validation.data;
    await service.deleteUser(userId, currentPassword);

    res
      .writeHead(204, {
        'Clear-Site-Data': '"cookies", "storage", "cache"',
        'Set-Cookie': 'refreshToken=; HttpOnly; Path=/; Max-Age=0',
      })
      .end();
  } catch (error) {
    errorHandler(res, error);
  }
};
