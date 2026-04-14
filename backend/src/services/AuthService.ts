import {
  comparePassword,
  generateAccessToken,
  generateEmailToken,
  generateRefreshToken,
  hashPassword,
  hashToken,
  verifyEmailToken,
  verifyRefreshToken,
  REFRESH_TOKEN_EXPIRES_MS,
} from '@utils';
import { userLogger } from '@logger';
import { EmailService } from './EmailService';
import { OAuthService } from './OAuthService';
import { ConflictError, NotFoundError, UnauthorizedError } from '@errors';
import type {
  RefreshTokenRepository,
  UserRepository,
} from '@repositories/interfaces';
import type {
  AuthTokens,
  DbUser,
  LoginWithEmail,
  LoginWithGoogle,
  RegisterWithEmail,
} from '@sharedCommon/schemas';

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private tokenRepository: RefreshTokenRepository,
    private emailService: EmailService,
    private oAuthService: OAuthService,
  ) {}

  private async generateAuthTokens(user: DbUser): Promise<AuthTokens> {
    const accessToken = generateAccessToken(user.userId);
    const refreshToken = generateRefreshToken(user.userId);

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);

    await this.tokenRepository.createRefreshToken(
      user.userId,
      tokenHash,
      expiresAt,
    );

    return { accessToken, refreshToken };
  }

  async registerWithEmail(data: RegisterWithEmail): Promise<DbUser> {
    const passwordHash = await hashPassword(data.password);
    const user = await this.userRepository.createUser({
      email: data.email,
      passwordHash,
    });

    const verificationToken = generateEmailToken(user.userId);
    await this.emailService.sendVerification(user.email, verificationToken);

    return user;
  }

  async loginWithEmail(data: LoginWithEmail): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new NotFoundError(`User with email ${data.email} not found`);
    }

    if (!user.passwordHash) {
      throw new UnauthorizedError('This account uses Google login');
    }

    const isPasswordValid = await comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid password');
    }

    return this.generateAuthTokens(user);
  }

  async authWithGoogle(data: LoginWithGoogle): Promise<AuthTokens> {
    const { googleId, email } = await this.oAuthService.verifyGoogleToken(
      data.token,
    );

    let user = await this.userRepository.findByGoogleId(googleId);

    if (!user) {
      const existingByEmail = await this.userRepository.findByEmail(email);
      if (existingByEmail) {
        throw new ConflictError(
          `Email ${email} is already registered. Try logging in with email and password`,
        );
      }
      user = await this.userRepository.createUser({ email, googleId });
    }

    return this.generateAuthTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const tokenHash = hashToken(refreshToken);
    const storedToken = await this.tokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedError('Refresh token not found');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired');
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new NotFoundError('Invalid credentials');
    }

    await this.tokenRepository.deleteByTokenHash(tokenHash);

    return this.generateAuthTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await this.tokenRepository.deleteByTokenHash(tokenHash);
  }

  async verifyEmail(token: string): Promise<void> {
    const payload = verifyEmailToken(token);

    if (!payload) throw new UnauthorizedError('Invalid or expired token');

    await this.userRepository.markVerified(payload.userId);
  }

  async resendVerification(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || user.isVerified) return;

    const verificationToken = generateEmailToken(user.userId);
    await this.emailService.sendVerification(user.email, verificationToken);
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    if (!user.passwordHash)
      throw new UnauthorizedError('This account uses Google login');

    const isValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    const newHash = await hashPassword(newPassword);

    // TODO: нужны транзакции - делать оба действия или ни одного
    await this.userRepository.updatePassword(userId, newHash);
    await this.tokenRepository.deleteAllByUserId(userId);
  }

  async deleteUser(userId: number, currentPassword?: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    if (user.passwordHash) {
      if (!currentPassword) {
        throw new UnauthorizedError('Password required');
      }

      const isValid = await comparePassword(currentPassword, user.passwordHash);
      if (!isValid) throw new UnauthorizedError('Invalid credentials');
    } else {
      // TODO: OAuth re-auth (email/Google re-login)
      throw new UnauthorizedError('Re-auth required');
    }

    // TODO: нужны транзакции - делать оба действия или ни одного
    await this.userRepository.deleteUser(userId);
    await this.tokenRepository.deleteAllByUserId(userId);

    userLogger.info({ userId }, 'User deleted');
  }
}
