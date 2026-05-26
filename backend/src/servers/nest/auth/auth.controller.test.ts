import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, expect, test, vi, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { AuthService } from '@services';
import {
  MockUserRepository,
  MockRefreshTokenRepository,
} from '@repositories/mock';
import { generateAccessToken, hashPassword } from '@utils';
import { AuthGuard } from '../common/auth.guard';
import { AppErrorFilter } from '../common/app-error.filter';
import { AuthController } from './auth.controller';

const authHeader = (userId: number) => `Bearer ${generateAccessToken(userId)}`;

const validPassword = 'Password1';
const validEmail = 'test@example.com';

const createVerifiedUser = async (
  repo: MockUserRepository,
  email: string = validEmail,
) => {
  const passwordHash = await hashPassword(validPassword);
  const user = await repo.createUser({
    email,
    passwordHash,
    isVerified: true,
  });
  return user;
};

describe('AuthController — unit-like (TestingModule + mock сервис)', () => {
  const mockService = {
    registerWithEmail: vi.fn(),
    loginWithEmail: vi.fn(),
    authWithGoogle: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    getCurrentUser: vi.fn(),
    verifyEmail: vi.fn(),
    resendVerification: vi.fn(),
    changePassword: vi.fn(),
    requestPasswordReset: vi.fn(),
    resetPassword: vi.fn(),
    deleteUser: vi.fn(),
  };

  const createController = async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    return moduleRef.get(AuthController);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('register — вызывает сервис и возвращает публичного пользователя', async () => {
    const controller = await createController();
    const user = {
      userId: 1,
      email: validEmail,
      isVerified: false,
      passwordHash: 'hash',
      googleId: null,
    };
    mockService.registerWithEmail.mockResolvedValue(user);

    const result = await controller.register({
      email: validEmail,
      password: validPassword,
    });

    expect(mockService.registerWithEmail).toHaveBeenCalledWith({
      email: validEmail,
      password: validPassword,
    });
    expect(result.user.hasPassword).toBe(true);
  });

  test('login — возвращает accessToken и ставит cookie', async () => {
    const controller = await createController();
    mockService.loginWithEmail.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    const res = { setHeader: vi.fn() } as unknown as import('express').Response;
    const result = await controller.login(
      { email: validEmail, password: validPassword },
      res,
    );

    expect(mockService.loginWithEmail).toHaveBeenCalledWith({
      email: validEmail,
      password: validPassword,
    });
    expect(res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringContaining('refreshToken=refresh'),
    );
    expect(result.accessToken).toBe('access');
  });

  test('me — возвращает публичного пользователя', async () => {
    const controller = await createController();
    const user = {
      userId: 1,
      email: validEmail,
      isVerified: true,
      passwordHash: 'hash',
      googleId: null,
    };
    mockService.getCurrentUser.mockResolvedValue(user);

    const result = await controller.me(1);

    expect(mockService.getCurrentUser).toHaveBeenCalledWith(1);
    expect(result.user.hasPassword).toBe(true);
  });

  test('deleteUser — вызывает сервис и возвращает 204-заголовки', async () => {
    const controller = await createController();
    mockService.deleteUser.mockResolvedValue(undefined);

    const res = {
      setHeader: vi.fn(),
    } as unknown as import('express').Response;

    await controller.deleteUser(1, {}, res);

    expect(mockService.deleteUser).toHaveBeenCalledWith(1, undefined);
    expect(res.setHeader).toHaveBeenCalledWith(
      'Clear-Site-Data',
      '"cookies", "storage", "cache"',
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      'refreshToken=; HttpOnly; Path=/; Max-Age=0',
    );
  });
});

describe('AuthController — HTTP интеграционные', () => {
  let app: INestApplication;
  let mockUserRepo: MockUserRepository;
  let mockTokenRepo: MockRefreshTokenRepository;

  const mockEmailService = {
    sendVerification: vi.fn(),
    sendPasswordChanged: vi.fn(),
    sendAccountDeleted: vi.fn(),
    sendPasswordReset: vi.fn(),
  };

  const mockOAuthService = {
    verifyGoogleToken: vi.fn(),
  };

  beforeEach(async () => {
    mockUserRepo = new MockUserRepository([]);
    mockTokenRepo = new MockRefreshTokenRepository();

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () =>
            new AuthService(
              mockUserRepo,
              mockTokenRepo,
              mockEmailService as unknown as import('@services').EmailService,
              mockOAuthService as unknown as import('@services').OAuthService,
            ),
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new AppErrorFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('POST /auth/register — создаёт пользователя', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: validEmail, password: validPassword })
      .expect(201);

    expect(response.body.message).toContain('created');
    expect(response.body.user.email).toBe(validEmail);
    expect(response.body.user.hasPassword).toBe(true);
    expect(response.body.user.userId).toBeDefined();
  });

  test('POST /auth/register с невалидным body → 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'bad', password: 'short' })
      .expect(400);

    expect(response.body.message).toBe('Invalid data');
  });

  test('POST /auth/login — авторизует верифицированного пользователя', async () => {
    await createVerifiedUser(mockUserRepo);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: validEmail, password: validPassword })
      .expect(200);

    expect(response.body.message).toBe('Successful login');
    expect(response.body.accessToken).toBeDefined();
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('refreshToken=')]),
    );
  });

  test('POST /auth/login неверный пароль → 401', async () => {
    await createVerifiedUser(mockUserRepo);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: validEmail, password: 'WrongPass1' })
      .expect(401);

    expect(response.body.error.statusCode).toBe(401);
  });

  test('GET /auth/me без заголовка Authorization → 401', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .expect(401);

    expect(response.body.error.statusCode).toBe(401);
  });

  test('GET /auth/me — возвращает текущего пользователя', async () => {
    const user = await createVerifiedUser(mockUserRepo);

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', authHeader(user.userId))
      .expect(200);

    expect(response.body.user.email).toBe(validEmail);
    expect(response.body.user.hasPassword).toBe(true);
  });

  test('POST /auth/logout — очищает cookie', async () => {
    await createVerifiedUser(mockUserRepo);
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: validEmail, password: validPassword });

    const cookie = loginRes.headers['set-cookie'];

    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.message).toBe('Successful logout');
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('Max-Age=0')]),
    );
  });

  test('POST /auth/refresh — возвращает новый accessToken и cookie', async () => {
    await createVerifiedUser(mockUserRepo);
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: validEmail, password: validPassword });

    const cookie = loginRes.headers['set-cookie'];

    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.message).toBe('Successful refresh');
    expect(response.body.accessToken).toBeDefined();
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('refreshToken=')]),
    );
  });

  test('POST /auth/refresh без cookie → 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .expect(401);

    expect(response.body.error.statusCode).toBe(401);
  });

  test('POST /auth/change-password — меняет пароль', async () => {
    const user = await createVerifiedUser(mockUserRepo);

    const response = await request(app.getHttpServer())
      .post('/auth/change-password')
      .set('Authorization', authHeader(user.userId))
      .send({ oldPassword: validPassword, newPassword: 'NewPass123' })
      .expect(200);

    expect(response.body.message).toBe('Password changed successfully');
  });

  test('POST /auth/forgot-password — всегда возвращает 200', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'nobody@example.com' })
      .expect(200);

    expect(response.body.message).toContain('If the account exists');
  });

  test('POST /auth/reset-password — сбрасывает пароль', async () => {
    const user = await createVerifiedUser(mockUserRepo);
    const { generatePasswordResetToken } = await import('@utils');
    const token = generatePasswordResetToken(user.userId);

    const response = await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({ token, newPassword: 'NewPass123' })
      .expect(200);

    expect(response.body.message).toBe('Password reset successful');
  });

  test('GET /auth/verify-email — верифицирует email', async () => {
    const user = await mockUserRepo.createUser({
      email: validEmail,
      passwordHash: 'hash',
    });
    const { generateEmailToken } = await import('@utils');
    const token = generateEmailToken(user.userId);

    const response = await request(app.getHttpServer())
      .get(`/auth/verify-email?token=${token}`)
      .expect(200);

    expect(response.body.message).toBe('Email verified successfully');
    expect(response.body.email).toBe(validEmail);
  });

  test('GET /auth/verify-email без токена → 401', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/verify-email')
      .expect(401);

    expect(response.body.error.statusCode).toBe(401);
  });

  test('POST /auth/delete-user — удаляет аккаунт и очищает сессию', async () => {
    const user = await createVerifiedUser(mockUserRepo);

    const response = await request(app.getHttpServer())
      .post('/auth/delete-user')
      .set('Authorization', authHeader(user.userId))
      .send({ currentPassword: validPassword })
      .expect(204);

    expect(response.headers['clear-site-data']).toBe(
      '"cookies", "storage", "cache"',
    );
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('Max-Age=0')]),
    );
  });
});
