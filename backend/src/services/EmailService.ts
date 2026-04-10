import { emailLogger } from '@logger';

export class EmailService {
  async sendVerification(email: string, token: string): Promise<void> {
    // TODO: подключение через Mailtrap
    emailLogger.info({ email, token }, 'Sending verification email');
  }

  async sendPasswordChanged(email: string): Promise<void> {
    // TODO: подключение через Mailtrap
    emailLogger.info({ email }, 'Sending password changed email');
  }
}
