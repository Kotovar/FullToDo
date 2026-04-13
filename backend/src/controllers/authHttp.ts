import {
  loginWithEmailSchema,
  loginWithGoogleSchema,
  publicUserSchema,
  registerWithEmailSchema,
  registerWithGoogleSchema,
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

// TODO: сделать ограничения на количество попыток, например:
// 5 попыток / 10 минут
// делать в middleware - до контроллера
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

// TODO: сделать ограничения на количество попыток, например:
// 5 попыток / 10 минут
// делать в middleware - до контроллера
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

    const { accessToken, refreshToken } = await service.loginWithGoogle(
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

// TODO: сделать ограничения на количество попыток, например:
// 5 попыток / 10 минут
// делать в middleware - до контроллера
export const refresh: ServiceHandler<AuthService> = async (
  { req, res },
  service,
) => {
  try {
    const { refreshToken } = parseCookies(req.headers.cookie);

    if (!refreshToken) {
      res
        .writeHead(401, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ message: 'Refresh token missing' }));
      return;
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
  const emailToken = getEmailToken(req);

  if (emailToken === null) {
    res
      .writeHead(400, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Invalid or missing email token' }));
    return;
  }

  try {
    await service.verifyEmail(emailToken);

    res.writeHead(200, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        message: 'Email verified successfully',
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
