import {
  checkContentType,
  errorHandler,
  handleValidationError,
  parseJsonBody,
} from './utils';
import { changePasswordSchema, deleteUserSchema } from '@sharedCommon/schemas';
import { httpAuthMiddleware } from '@middleware';
import type { ServiceHandler } from './types';
import type { AuthService } from '@services/AuthService';

// TODO: rate limiting — 5 попыток / 10 минут per IP
// реализовать как middleware до контроллера, счётчики хранить в Redis
export const changePassword: ServiceHandler<AuthService> = async (
  ctx,
  service,
) => {
  const { req, res } = ctx;
  try {
    if (!checkContentType(req, res)) return;

    const { userId } = httpAuthMiddleware(ctx);

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

export const deleteUser: ServiceHandler<AuthService> = async (ctx, service) => {
  const { req, res } = ctx;
  try {
    if (!checkContentType(req, res)) return;

    const { userId } = httpAuthMiddleware(ctx);

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
