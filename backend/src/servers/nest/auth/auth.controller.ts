import type { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@services';
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
import type {
  ChangePassword,
  DeleteUser,
  ForgotPassword,
  LoginWithEmail,
  LoginWithGoogle,
  RegisterWithEmail,
  ResetPassword,
} from '@sharedCommon/schemas';
import { ROUTES } from '@sharedCommon/routes';
import { buildRefreshCookie } from '@controllers';
import { UnauthorizedError } from '@errors';
import { AuthGuard } from '../common/auth.guard';
import { RefreshToken } from '../common/cookies.decorator';
import { UserId } from '../common/user-id.decorator';
import { ZodValidationPipe } from '../common/zod-validation.pipe';

/**
 * Nest-контроллер для аутентификации и управления пользователем.
 *
 * Реализует все маршруты `/auth/*` через {@link AuthService}.
 * Публичные маршруты не требуют guard; защищённые используют {@link AuthGuard}.
 * Cookie с refresh-токеном управляется через {@link Res} с `passthrough: true`,
 * чтобы Nest продолжал сериализовать JSON-ответ.
 */
@ApiTags('Auth')
@Controller(ROUTES.auth.base)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerWithEmailSchema))
    data: RegisterWithEmail,
  ) {
    const user = await this.authService.registerWithEmail(data);
    return {
      message: `User "${user.userId}" created`,
      user: publicUserSchema.parse(user),
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body(new ZodValidationPipe(loginWithEmailSchema))
    data: LoginWithEmail,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginWithEmail(data);
    res.setHeader('Set-Cookie', buildRefreshCookie(refreshToken));
    return { message: 'Successful login', accessToken };
  }

  @Post('google')
  @HttpCode(200)
  async googleAuth(
    @Body(new ZodValidationPipe(loginWithGoogleSchema))
    data: LoginWithGoogle,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.authWithGoogle(data);
    res.setHeader('Set-Cookie', buildRefreshCookie(refreshToken));
    return { message: 'Successful auth', accessToken };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @RefreshToken() refreshToken: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    res.setHeader('Set-Cookie', buildRefreshCookie('', 0));
    return { message: 'Successful logout' };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @RefreshToken() refreshToken: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token missing');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    res.setHeader('Set-Cookie', buildRefreshCookie(newRefreshToken));
    return { message: 'Successful refresh', accessToken };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async me(@UserId() userId: number) {
    const user = await this.authService.getCurrentUser(userId);
    return { user: publicUserSchema.parse(user) };
  }

  @Get('verify-email')
  async verifyEmail(@Query() query: Record<string, unknown>) {
    const validation = emailTokenSchema.safeParse(query);
    if (!validation.success) {
      throw new UnauthorizedError('Invalid or missing email token');
    }

    const { status, email } = await this.authService.verifyEmail(
      validation.data.token,
    );

    return {
      message:
        status === 'verified'
          ? 'Email verified successfully'
          : 'Email already verified',
      email,
    };
  }

  @Post('resend-verification')
  @HttpCode(200)
  async resendVerification(
    @Body(new ZodValidationPipe(resendVerificationSchema))
    data: {
      email: string;
    },
  ) {
    await this.authService.resendVerification(data.email);
    return { message: 'Verification email sent' };
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async changePassword(
    @UserId() userId: number,
    @Body(new ZodValidationPipe(changePasswordSchema))
    data: ChangePassword,
  ) {
    const { oldPassword, newPassword } = data;

    await this.authService.changePassword(userId, oldPassword, newPassword);
    return { message: 'Password changed successfully' };
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(
    @Body(new ZodValidationPipe(forgotPasswordSchema))
    data: ForgotPassword,
  ) {
    await this.authService.requestPasswordReset(data.email);
    return {
      message: 'If the account exists, password reset instructions were sent',
    };
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema))
    data: ResetPassword,
  ) {
    const { token, newPassword } = data;

    await this.authService.resetPassword(token, newPassword);
    return { message: 'Password reset successful' };
  }

  @Post('delete-user')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  async deleteUser(
    @UserId() userId: number,
    @Body(new ZodValidationPipe(deleteUserSchema))
    data: DeleteUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.deleteUser(userId, data.currentPassword);
    res.setHeader('Clear-Site-Data', '"cookies", "storage", "cache"');
    res.setHeader('Set-Cookie', 'refreshToken=; HttpOnly; Path=/; Max-Age=0');
  }
}
