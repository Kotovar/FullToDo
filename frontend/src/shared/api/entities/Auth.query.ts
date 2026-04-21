import { BaseService, AUTH_ERRORS, HEADERS } from '@shared/api';
import { authFetch, clearAccessToken, setAccessToken } from '@shared/api/auth';
import { authRoutes } from './Auth.query.config';
import {
  getUnauthorizedAuthError,
  parseAuthErrorPayload,
} from './Auth.query.utils';
import type {
  AuthAccessTokenResponse,
  AuthMessageResponse,
  AuthUserResponse,
} from './Auth.query.types';
import type {
  ChangePassword,
  DeleteUser,
  LoginWithEmail,
  LoginWithGoogle,
  PublicUser,
  RegisterWithEmail,
} from '@sharedCommon';

class AuthService extends BaseService {
  protected async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) return response.json();

    switch (response.status) {
      case 401: {
        const payload = await parseAuthErrorPayload(response);

        throw new Error('Unauthorized', {
          cause: getUnauthorizedAuthError(payload),
        });
      }
      case 404:
        throw new Error('Not found', { cause: AUTH_ERRORS.UNDEFINED });
      case 409:
        throw new Error('Conflict', { cause: AUTH_ERRORS.CONFLICT });
      default:
        throw new Error('Server error', { cause: AUTH_ERRORS.SERVER_ERROR });
    }
  }

  protected async handleError(error: unknown): Promise<never> {
    if (error instanceof Error && error.cause) {
      throw error;
    }

    throw new Error('Network error', { cause: AUTH_ERRORS.NETWORK_ERROR });
  }

  async register(credentials: RegisterWithEmail): Promise<AuthUserResponse> {
    try {
      const response = await authFetch(authRoutes.register, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(credentials),
        withAuth: false,
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async login(credentials: LoginWithEmail): Promise<AuthAccessTokenResponse> {
    try {
      const response = await authFetch(authRoutes.login, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(credentials),
        withAuth: false,
      });
      const data = await this.handleResponse<AuthAccessTokenResponse>(response);

      setAccessToken(data.accessToken);

      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async loginWithGoogle(
    credentials: LoginWithGoogle,
  ): Promise<AuthAccessTokenResponse> {
    try {
      const response = await authFetch(authRoutes.google, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(credentials),
        withAuth: false,
      });
      const data = await this.handleResponse<AuthAccessTokenResponse>(response);

      setAccessToken(data.accessToken);

      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async me(): Promise<AuthUserResponse> {
    try {
      const response = await authFetch(authRoutes.me);

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async refresh(): Promise<AuthAccessTokenResponse> {
    try {
      const response = await authFetch(authRoutes.refresh, {
        method: 'POST',
        withAuth: false,
      });
      const data = await this.handleResponse<AuthAccessTokenResponse>(response);

      setAccessToken(data.accessToken);

      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<AuthMessageResponse> {
    try {
      const response = await authFetch(authRoutes.logout, {
        method: 'POST',
        withAuth: false,
      });
      const data = await this.handleResponse<AuthMessageResponse>(response);

      clearAccessToken();

      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async verifyEmail(token: string): Promise<AuthMessageResponse> {
    try {
      const response = await authFetch(authRoutes.verifyEmail(token), {
        withAuth: false,
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async changePassword(
    credentials: ChangePassword,
  ): Promise<AuthMessageResponse> {
    try {
      const response = await authFetch(authRoutes.changePassword, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(credentials),
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteUser(credentials: DeleteUser): Promise<AuthMessageResponse> {
    try {
      const response = await authFetch(authRoutes.deleteUser, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(credentials),
      });

      if (response.status === 204) {
        clearAccessToken();
        return { message: 'Account deleted' };
      }

      const data = await this.handleResponse<AuthMessageResponse>(response);

      clearAccessToken();

      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const authService = new AuthService();

export const fetchCurrentUser = async (): Promise<PublicUser> => {
  const { user } = await authService.me();
  return user;
};

export { authKeys, getUserQueryScope } from './Auth.query.config';
