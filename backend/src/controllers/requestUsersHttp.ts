import {
  publicUserSchema,
  registerWithEmailSchema,
  registerWithGoogleSchema,
} from '@sharedCommon/schemas';
import {
  checkContentType,
  errorHandler,
  handleValidationError,
  parseJsonBody,
} from './utils';
import type { ServiceHandler } from './types';
import type { AuthService } from '@services/AuthService';

export const registerWithEmail: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    if (!checkContentType(req, res)) return;

    const raw = await parseJsonBody(req);
    const validation = registerWithEmailSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    const user = await service.registerWithEmail(validation.data);

    res.writeHead(201, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        message: `User "${user.userId}" created`,
        user: publicUserSchema.parse(user),
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

export const registerWithGoogle: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    if (!checkContentType(req, res)) return;

    const raw = await parseJsonBody(req);
    const validation = registerWithGoogleSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    const user = await service.registerWithGoogle(validation.data);

    res.writeHead(201, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        message: `User "${user.userId}" created`,
        user: publicUserSchema.parse(user),
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};
