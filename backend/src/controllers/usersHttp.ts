import {
  checkContentType,
  errorHandler,
  handleValidationError,
  parseJsonBody,
} from './utils';
import { verifyAccessToken } from '@utils';
import { UnauthorizedError } from '@errors/AppError';
import { changePasswordSchema, deleteUserSchema } from '@sharedCommon/schemas';
import type { ServiceHandler } from './types';
import type { AuthService } from '@services/AuthService';

// TODO: сделать ограничения на количество попыток, например:
// 5 попыток / 10 минут
// делать в middleware - до контроллера
export const changePassword: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    if (!checkContentType(req, res)) return;

    // TODO: Сделать auth middleware
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res
        .writeHead(401, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ message: 'Unauthorized' }));
      return;
    }

    const accessToken = authHeader.split(' ')[1];
    // TODO: вынести в middleware: handler знает слишком много про auth
    const payload = verifyAccessToken(accessToken);

    if (!payload) throw new UnauthorizedError('Invalid access token');

    const raw = await parseJsonBody(req);
    const validation = changePasswordSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    const { userId } = payload;
    const { oldPassword, newPassword } = validation.data;

    await service.changePassword(userId, oldPassword, newPassword);

    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Password changed successfully' }));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteUser: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    if (!checkContentType(req, res)) return;

    // TODO: Сделать auth middleware
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res
        .writeHead(401, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ message: 'Unauthorized' }));
      return;
    }

    const accessToken = authHeader.split(' ')[1];

    // TODO: вынести в middleware: handler знает слишком много про auth
    const payload = verifyAccessToken(accessToken);

    if (!payload) throw new UnauthorizedError('Invalid access token');

    const raw = await parseJsonBody(req);
    const validation = deleteUserSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    const { userId } = payload;
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
