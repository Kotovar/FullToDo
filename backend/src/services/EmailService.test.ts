import { describe, expect, test, vi } from 'vitest';
import { EmailService } from './EmailService';
import type { EmailProvider } from './emailProviders';

describe('EmailService', () => {
  const createService = () => {
    const emailProvider: EmailProvider = {
      sendEmail: vi.fn().mockResolvedValue(undefined),
    };

    return {
      emailProvider,
      service: new EmailService(emailProvider),
    };
  };

  test('sends verification email through configured provider', async () => {
    const { emailProvider, service } = createService();

    await service.sendVerification('user@example.com', 'token');

    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Подтвердите email — FullToDo',
      html: expect.any(String),
    });
  });

  test('sends password changed email through configured provider', async () => {
    const { emailProvider, service } = createService();

    await service.sendPasswordChanged('user@example.com');

    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Пароль изменён — FullToDo',
      html: expect.any(String),
    });
  });

  test('sends account deleted email through configured provider', async () => {
    const { emailProvider, service } = createService();

    await service.sendAccountDeleted('user@example.com');

    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Аккаунт удалён — FullToDo',
      html: expect.any(String),
    });
  });
});
