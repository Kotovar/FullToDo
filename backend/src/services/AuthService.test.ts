import { describe, expect, test, vi } from 'vitest';
import { AuthService } from './AuthService';
import { EmailService } from './EmailService';
import { OAuthService } from './OAuthService';
import { MockRefreshTokenRepository } from '@repositories/mock/MockRefreshTokenRepository';
import { MockUserRepository } from '@repositories/mock/MockUserRepository';
import { hashPassword } from '@utils';
import type { DbUser, GoogleProfile } from '@sharedCommon/schemas';

const USER_EMAIL = 'user@gmail.com';
const GOOGLE_ID = 'google-user-id';

const createAuthService = async (profile: GoogleProfile) => {
  const userRepository = new MockUserRepository([
    {
      userId: 1,
      email: USER_EMAIL,
      passwordHash: await hashPassword('Password1'),
      isVerified: false,
    },
  ]);
  const tokenRepository = new MockRefreshTokenRepository();
  const emailService = {} as EmailService;
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
