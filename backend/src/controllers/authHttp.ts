import {
  loginWithEmailSchema,
  loginWithGoogleSchema,
  publicUserSchema,
  registerWithEmailSchema,
  resendVerificationSchema,
} from '@sharedCommon/schemas';
import {
  checkContentType,
  errorHandler,
  getEmailToken,
  handleValidationError,
  parseCookies,
  parseJsonBody,
  setRefreshCookie,
} from './utils';
import { httpAuthMiddleware } from '@middleware';
import { UnauthorizedError } from '@errors/AppError';
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

// TODO: rate limiting — 5 попыток / 10 минут per IP
// реализовать как middleware до контроллера, счётчики хранить в Redis
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

    const { accessToken, refreshToken } = await service.loginWithEmail(
      validation.data,
    );

    res.writeHead(200, setRefreshCookie(refreshToken)).end(
      JSON.stringify({
        message: 'Successful login',
        accessToken,
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

// TODO: rate limiting — 5 попыток / 10 минут per IP
// реализовать как middleware до контроллера, счётчики хранить в Redis
export const authWithGoogle: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    if (!checkContentType(req, res)) return;

    const raw = await parseJsonBody(req);
    const validation = loginWithGoogleSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    const { accessToken, refreshToken } = await service.authWithGoogle(
      validation.data,
    );

    res.writeHead(200, setRefreshCookie(refreshToken)).end(
      JSON.stringify({
        message: 'Successful auth',
        accessToken,
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

export const logout: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    const { refreshToken } = parseCookies(req.headers.cookie);

    if (refreshToken) {
      await service.logout(refreshToken);
    }

    res.writeHead(200, setRefreshCookie('', 0)).end(
      JSON.stringify({
        message: 'Successful logout',
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

// TODO: rate limiting — 5 попыток / 10 минут per IP
// реализовать как middleware до контроллера, счётчики хранить в Redis
export const refresh: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    const { refreshToken } = parseCookies(req.headers.cookie);

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token missing');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await service.refresh(refreshToken);

    res.writeHead(200, setRefreshCookie(newRefreshToken)).end(
      JSON.stringify({
        message: 'Successful refresh',
        accessToken,
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

export const verifyEmail: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    const emailToken = getEmailToken(req);

    if (emailToken === null) {
      throw new UnauthorizedError('Invalid or missing email token');
    }

    const status = await service.verifyEmail(emailToken);

    res.writeHead(200, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        message:
          status === 'verified'
            ? 'Email verified successfully'
            : 'Email already verified',
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getCurrentUser: ServiceHandler<AuthService> = async (
  ctx,
  service,
) => {
  const { res } = ctx;

  try {
    const { userId } = httpAuthMiddleware(ctx);
    const user = await service.getCurrentUser(userId);

    res.writeHead(200, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        user: publicUserSchema.parse(user),
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

export const resendVerification: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    if (!checkContentType(req, res)) return;

    const raw = await parseJsonBody(req);
    const validation = resendVerificationSchema.safeParse(raw);

    if (!validation.success)
      return handleValidationError(res, validation.error);

    await service.resendVerification(validation.data.email);

    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Verification email sent' }));
  } catch (error) {
    errorHandler(res, error);
  }
};
