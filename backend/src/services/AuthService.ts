import {
  comparePassword,
  generateAccessToken,
  generateEmailToken,
  generateRefreshToken,
  hashPassword,
  hashToken,
  REFRESH_TOKEN_EXPIRES_MS,
  verifyRefreshToken,
} from '@utils';
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
  RegisterWithGoogle,
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

  async registerWithGoogle(data: RegisterWithGoogle): Promise<DbUser> {
    const { googleId, email } = await this.oAuthService.verifyGoogleToken(
      data.token,
    );

    const existingByGoogle = await this.userRepository.findByGoogleId(googleId);
    if (existingByGoogle) {
      throw new ConflictError(`User with this Google account already exists`);
    }

    const existingByEmail = await this.userRepository.findByEmail(email);
    if (existingByEmail) {
      throw new ConflictError(
        `Email ${email} is already registered. Try logging in with email and password`,
      );
    }

    return this.userRepository.createUser({ email, googleId });
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

  async loginWithGoogle(data: LoginWithGoogle): Promise<AuthTokens> {
    const { googleId } = await this.oAuthService.verifyGoogleToken(data.token);

    const user = await this.userRepository.findByGoogleId(googleId);

    if (!user) {
      throw new NotFoundError(`User with googleId ${googleId} not found`);
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
      throw new NotFoundError('User not found');
    }

    await this.tokenRepository.deleteByTokenHash(tokenHash);

    return this.generateAuthTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await this.tokenRepository.deleteByTokenHash(tokenHash);
  }
}
