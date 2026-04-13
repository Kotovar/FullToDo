import {
  loginWithEmailSchema,
  loginWithGoogleSchema,
} from '@sharedCommon/schemas';
import {
  checkContentType,
  errorHandler,
  handleValidationError,
  parseJsonBody,
} from './utils';
import type { ServiceHandler } from './types';
import type { AuthService } from '@services/AuthService';
import { REFRESH_TOKEN_EXPIRES_S } from '@utils';
import { ROUTES } from '@sharedCommon/routes';

const setHeader = (token: string) => {
  const secure = process.env.NODE_ENV === 'production' ? ' Secure;' : '';

  return {
    'Content-Type': 'application/json',
    'Set-Cookie': `refreshToken=${token}; HttpOnly;${secure} SameSite=Strict; Path=${ROUTES.AUTH}; Max-Age=${REFRESH_TOKEN_EXPIRES_S}`,
  };
};

export const loginWithEmail: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    if (!checkContentType(req, res)) return;

    const raw = await parseJsonBody(req);
    const validation = loginWithEmailSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    const tokens = await service.loginWithEmail(validation.data);

    res.writeHead(200, setHeader(tokens.refreshToken)).end(
      JSON.stringify({
        message: 'Successful login',
        accessToken: tokens.accessToken,
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

export const loginWithGoogle: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    if (!checkContentType(req, res)) return;

    const raw = await parseJsonBody(req);
    const validation = loginWithGoogleSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    const tokens = await service.loginWithGoogle(validation.data);

    res.writeHead(200, setHeader(tokens.refreshToken)).end(
      JSON.stringify({
        message: 'Successful login',
        accessToken: tokens.accessToken,
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};
