import type {
  AuthTokens,
  DbUser,
  LoginWithEmail,
  LoginWithGoogle,
  RegisterWithEmail,
  RegisterWithGoogle,
} from '@sharedCommon/schemas';

export class AuthService {
  async registerWithEmail(_data: RegisterWithEmail): Promise<DbUser> {
    throw new Error('AuthService.registerWithEmail not implemented');
  }
  async registerWithGoogle(_data: RegisterWithGoogle): Promise<DbUser> {
    throw new Error('AuthService.registerWithGoogle not implemented');
  }

  async loginWithEmail(_data: LoginWithEmail): Promise<AuthTokens> {
    throw new Error('AuthService.loginWithEmail not implemented');
  }

  async loginWithGoogle(_data: LoginWithGoogle): Promise<AuthTokens> {
    throw new Error('AuthService.loginWithGoogle not implemented');
  }

  async refresh(_refreshToken: string): Promise<AuthTokens> {
    throw new Error('AuthService.refresh not implemented');
  }

  async logout(_refreshToken: string): Promise<void> {
    throw new Error('AuthService.logout not implemented');
  }
}
