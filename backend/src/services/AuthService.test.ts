import { describe, expect, test, vi } from 'vitest';
import { AuthService } from './AuthService';
import { EmailService } from './EmailService';
import { OAuthService } from './OAuthService';
import { MockRefreshTokenRepository } from '@repositories/mock/MockRefreshTokenRepository';
import { MockUserRepository } from '@repositories/mock/MockUserRepository';
import {
  comparePassword,
  generatePasswordResetToken,
  hashPassword,
} from '@utils';
import type { DbUser, GoogleProfile } from '@sharedCommon/schemas';

const USER_EMAIL = 'user@gmail.com';
const GOOGLE_EMAIL = 'google@gmail.com';
const GOOGLE_ID = 'google-user-id';
const GOOGLE_ONLY_ID = 'google-only-user-id';

const createAuthService = async (profile: GoogleProfile) => {
  const emailService = {
    sendPasswordReset: vi.fn().mockResolvedValue(undefined),
    sendPasswordChanged: vi.fn().mockResolvedValue(undefined),
  } as unknown as EmailService;

  const userRepository = new MockUserRepository([
    {
      userId: 1,
      email: USER_EMAIL,
      passwordHash: await hashPassword('Password1'),
      isVerified: false,
    },
    {
      userId: 2,
      email: GOOGLE_EMAIL,
      googleId: GOOGLE_ONLY_ID,
      isVerified: true,
    },
  ]);
  const tokenRepository = new MockRefreshTokenRepository();
  const oAuthService = {
    verifyGoogleToken: vi.fn().mockResolvedValue(profile),
  } as unknown as OAuthService;

  return {
    authService: new AuthService(
      userRepository,
      tokenRepository,
      emailService,
      oAuthService,
    ),
    emailService,
    tokenRepository,
    userRepository,
  };
};

describe('AuthService.authWithGoogle', () => {
  test('links Google account to existing email/password user when Google email is verified', async () => {
    const { authService, userRepository } = await createAuthService({
      googleId: GOOGLE_ID,
      email: USER_EMAIL,
      emailVerified: true,
    });

    const tokens = await authService.authWithGoogle({ token: 'google-token' });
    const linkedUser = (await userRepository.findByEmail(USER_EMAIL)) as DbUser;

    expect(tokens.accessToken).toEqual(expect.any(String));
    expect(tokens.refreshToken).toEqual(expect.any(String));
    expect(linkedUser.googleId).toBe(GOOGLE_ID);
    expect(linkedUser.passwordHash).toEqual(expect.any(String));
    expect(linkedUser.isVerified).toBe(true);
  });

  test('does not link Google account to existing user when Google email is not verified', async () => {
    const { authService, userRepository } = await createAuthService({
      googleId: GOOGLE_ID,
      email: USER_EMAIL,
      emailVerified: false,
    });

    await expect(
      authService.authWithGoogle({ token: 'google-token' }),
    ).rejects.toThrow('Google email is not verified');

    const user = (await userRepository.findByEmail(USER_EMAIL)) as DbUser;
    expect(user.googleId).toBeUndefined();
    expect(user.isVerified).toBe(false);
  });
});

describe('AuthService password reset', () => {
  test('sends password reset email with tokenized reset URL for password user', async () => {
    const { authService, emailService } = await createAuthService({
      googleId: GOOGLE_ID,
      email: USER_EMAIL,
      emailVerified: true,
    });

    await authService.requestPasswordReset(USER_EMAIL);

    expect(emailService.sendPasswordReset).toHaveBeenCalledWith(
      USER_EMAIL,
      expect.stringContaining('/reset-password?token='),
    );
  });

  test('does not reveal missing user during password reset request', async () => {
    const { authService, emailService } = await createAuthService({
      googleId: GOOGLE_ID,
      email: USER_EMAIL,
      emailVerified: true,
    });

    await expect(
      authService.requestPasswordReset('missing@example.com'),
    ).resolves.toBeUndefined();
    expect(emailService.sendPasswordReset).not.toHaveBeenCalled();
  });

  test('does not send password reset email for google-only user', async () => {
    const { authService, emailService } = await createAuthService({
      googleId: GOOGLE_ID,
      email: USER_EMAIL,
      emailVerified: true,
    });

    await authService.requestPasswordReset(GOOGLE_EMAIL);

    expect(emailService.sendPasswordReset).not.toHaveBeenCalled();
  });

  test('resets password and invalidates refresh tokens for valid reset token', async () => {
    const { authService, emailService, tokenRepository, userRepository } =
      await createAuthService({
        googleId: GOOGLE_ID,
        email: USER_EMAIL,
        emailVerified: true,
      });
    await tokenRepository.createRefreshToken(1, 'token-hash', new Date());

    await authService.resetPassword(generatePasswordResetToken(1), 'Password2');

    const user = (await userRepository.findByEmail(USER_EMAIL)) as DbUser;
    expect(await comparePassword('Password2', user.passwordHash ?? '')).toBe(
      true,
    );
    expect(await tokenRepository.findByTokenHash('token-hash')).toBeNull();
    expect(emailService.sendPasswordChanged).toHaveBeenCalledWith(USER_EMAIL);
  });

  test('rejects invalid password reset token', async () => {
    const { authService } = await createAuthService({
      googleId: GOOGLE_ID,
      email: USER_EMAIL,
      emailVerified: true,
    });

    await expect(
      authService.resetPassword('invalid.token.here', 'Password2'),
    ).rejects.toThrow('Invalid or expired token');
  });
});
