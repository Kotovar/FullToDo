import { Router } from 'express';
import {
  changePasswordSchema,
  deleteUserSchema,
  emailTokenSchema,
  forgotPasswordSchema,
  loginWithEmailSchema,
  loginWithGoogleSchema,
  publicUserSchema,
  registerWithEmailSchema,
  resendVerificationSchema,
  resetPasswordSchema,
} from '@sharedCommon/schemas';
import { ROUTES } from '@sharedCommon/routes';
import {
  expressAuthMiddleware,
  expressCheckContentType,
  expressRateLimit,
} from '@middleware';
import {
  expressHandleValidationError,
  getAccountRateLimitKey,
  parseCookies,
  setRefreshCookie,
} from '@controllers';
import { NotFoundError, UnauthorizedError } from '@errors/AppError';
import { authService } from './services';

export const authRouter = Router();

const refreshFailureRateLimitOptions = {
  keyPrefix: 'auth:refresh:failed',
  maxRequests: 5,
  windowSeconds: 10 * 60,
};

const isRefreshAuthFailure = (error: unknown) =>
  error instanceof UnauthorizedError || error instanceof NotFoundError;

authRouter.post(
  ROUTES.auth.register,
  expressCheckContentType,
  async (req, res) => {
    const validation = registerWithEmailSchema.safeParse(req.body);
    if (!validation.success) {
      expressHandleValidationError(res, validation.error);
      return;
    }

    const user = await authService.registerWithEmail(validation.data);

    res.status(201).json({
      message: `User "${user.userId}" created`,
      user: publicUserSchema.parse(user),
    });
  },
);

authRouter.post(
  ROUTES.auth.login,
  expressCheckContentType,
  async (req, res) => {
    await expressRateLimit(req, {
      keyPrefix: 'auth:login:ip',
      maxRequests: 30,
      windowSeconds: 10 * 60,
    });

    const validation = loginWithEmailSchema.safeParse(req.body);
    if (!validation.success) {
      expressHandleValidationError(res, validation.error);
      return;
    }

    await expressRateLimit(req, {
      keyPrefix: `auth:login:account:${getAccountRateLimitKey(
        validation.data.email,
      )}`,
      maxRequests: 5,
      windowSeconds: 10 * 60,
    });

    const { accessToken, refreshToken } = await authService.loginWithEmail(
      validation.data,
    );

    res
      .set(setRefreshCookie(refreshToken))
      .status(200)
      .json({ message: 'Successful login', accessToken });
  },
);

authRouter.post(
  ROUTES.auth.google,
  expressCheckContentType,
  async (req, res) => {
    await expressRateLimit(req, {
      keyPrefix: 'auth:google',
      maxRequests: 5,
      windowSeconds: 10 * 60,
    });

    const validation = loginWithGoogleSchema.safeParse(req.body);
    if (!validation.success) {
      expressHandleValidationError(res, validation.error);
      return;
    }

    const { accessToken, refreshToken } = await authService.authWithGoogle(
      validation.data,
    );

    res
      .set(setRefreshCookie(refreshToken))
      .status(200)
      .json({ message: 'Successful auth', accessToken });
  },
);

authRouter.post(ROUTES.auth.logout, async (req, res) => {
  const { refreshToken } = parseCookies(req.headers.cookie);

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res
    .set(setRefreshCookie('', 0))
    .status(200)
    .json({ message: 'Successful logout' });
});

authRouter.post(ROUTES.auth.refresh, async (req, res) => {
  const { refreshToken } = parseCookies(req.headers.cookie);

  try {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token missing');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refresh(refreshToken);

    res
      .set(setRefreshCookie(newRefreshToken))
      .status(200)
      .json({ message: 'Successful refresh', accessToken });
  } catch (error) {
    if (refreshToken && isRefreshAuthFailure(error)) {
      await expressRateLimit(req, refreshFailureRateLimitOptions);
    }

    throw error;
  }
});

authRouter.get(ROUTES.auth.me, expressAuthMiddleware, async (req, res) => {
  const user = await authService.getCurrentUser(req.userId);
  res.status(200).json({ user: publicUserSchema.parse(user) });
});

authRouter.get(ROUTES.auth.verifyEmail, async (req, res) => {
  const validation = emailTokenSchema.safeParse(req.query);
  if (!validation.success) {
    throw new UnauthorizedError('Invalid or missing email token');
  }

  const { status, email } = await authService.verifyEmail(
    validation.data.token,
  );

  res.status(200).json({
    message:
      status === 'verified'
        ? 'Email verified successfully'
        : 'Email already verified',
    email,
  });
});

authRouter.post(
  ROUTES.auth.resendVerification,
  expressCheckContentType,
  async (req, res) => {
    const validation = resendVerificationSchema.safeParse(req.body);
    if (!validation.success) {
      expressHandleValidationError(res, validation.error);
      return;
    }

    await authService.resendVerification(validation.data.email);

    res.status(200).json({ message: 'Verification email sent' });
  },
);

authRouter.post(
  ROUTES.auth.changePassword,
  expressAuthMiddleware,
  expressCheckContentType,
  async (req, res) => {
    await expressRateLimit(req, {
      keyPrefix: `auth:change-password:user:${req.userId}`,
      maxRequests: 5,
      windowSeconds: 10 * 60,
    });

    const validation = changePasswordSchema.safeParse(req.body);
    if (!validation.success) {
      expressHandleValidationError(res, validation.error);
      return;
    }

    const { oldPassword, newPassword } = validation.data;
    await authService.changePassword(req.userId, oldPassword, newPassword);

    res.status(200).json({ message: 'Password changed successfully' });
  },
);

authRouter.post(
  ROUTES.auth.forgotPassword,
  expressCheckContentType,
  async (req, res) => {
    await expressRateLimit(req, {
      keyPrefix: 'auth:forgot-password:ip',
      maxRequests: 5,
      windowSeconds: 10 * 60,
    });

    const validation = forgotPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      expressHandleValidationError(res, validation.error);
      return;
    }

    await expressRateLimit(req, {
      keyPrefix: `auth:forgot-password:account:${getAccountRateLimitKey(
        validation.data.email,
      )}`,
      maxRequests: 3,
      windowSeconds: 30 * 60,
    });

    await authService.requestPasswordReset(validation.data.email);

    res.status(200).json({
      message: 'If the account exists, password reset instructions were sent',
    });
  },
);

authRouter.post(
  ROUTES.auth.resetPassword,
  expressCheckContentType,
  async (req, res) => {
    await expressRateLimit(req, {
      keyPrefix: 'auth:reset-password:ip',
      maxRequests: 10,
      windowSeconds: 10 * 60,
    });

    const validation = resetPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      expressHandleValidationError(res, validation.error);
      return;
    }

    const { token, newPassword } = validation.data;
    await authService.resetPassword(token, newPassword);

    res.status(200).json({ message: 'Password reset successful' });
  },
);

authRouter.post(
  ROUTES.auth.deleteUser,
  expressAuthMiddleware,
  expressCheckContentType,
  async (req, res) => {
    await expressRateLimit(req, {
      keyPrefix: `auth:delete-user:user:${req.userId}`,
      maxRequests: 5,
      windowSeconds: 10 * 60,
    });

    const validation = deleteUserSchema.safeParse(req.body);
    if (!validation.success) {
      expressHandleValidationError(res, validation.error);
      return;
    }

    await authService.deleteUser(req.userId, validation.data.currentPassword);

    res
      .status(204)
      .set({
        'Clear-Site-Data': '"cookies", "storage", "cache"',
        'Set-Cookie': 'refreshToken=; HttpOnly; Path=/; Max-Age=0',
      })
      .end();
  },
);
