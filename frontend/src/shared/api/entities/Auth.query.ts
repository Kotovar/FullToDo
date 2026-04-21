import { ROUTES } from 'shared/routes';
import {
  BaseService,
  AUTH_ERRORS,
  COMMON_ERRORS,
  HEADERS,
  URL,
} from '@shared/api';
import { authFetch, clearAccessToken, setAccessToken } from '@shared/api/auth';
import type {
  LoginWithEmail,
  LoginWithGoogle,
  PublicUser,
  RegisterWithEmail,
} from 'shared/schemas';

if (!URL) {
  throw new Error(COMMON_ERRORS.URL.message);
}

const authRoutes = {
  register: `${URL}${ROUTES.auth.register}`,
  login: `${URL}${ROUTES.auth.login}`,
  google: `${URL}${ROUTES.auth.google}`,
  logout: `${URL}${ROUTES.auth.logout}`,
  refresh: `${URL}${ROUTES.auth.refresh}`,
  me: `${URL}${ROUTES.auth.me}`,
  verifyEmail: (token: string) =>
    `${URL}${ROUTES.auth.verifyEmail}?token=${encodeURIComponent(token)}`,
} as const;

export const authKeys = {
  me: () => ['auth', 'me'] as const,
};

export const getUserQueryScope = (userId?: number | null) => userId ?? 'guest';

export type AuthUserResponse = {
  user: PublicUser;
};

export type AuthAccessTokenResponse = {
  message: string;
  accessToken: string;
};

export type AuthMessageResponse = {
  message: string;
};

export const fetchCurrentUser = async (): Promise<PublicUser> => {
  const { user } = await authService.me();
  return user;
};

class AuthService extends BaseService {
  protected async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) return response.json();

    switch (response.status) {
      case 401:
        throw new Error('Unauthorized', { cause: AUTH_ERRORS.UNAUTHORIZED });
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
}

export const authService = new AuthService();
