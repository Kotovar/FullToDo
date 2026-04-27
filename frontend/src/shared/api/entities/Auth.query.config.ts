import { ROUTES } from 'shared/routes';
import { COMMON_ERRORS, URL } from '../consts';

if (!URL) {
  throw new Error(COMMON_ERRORS.URL.message);
}

export const authRoutes = {
  register: `${URL}${ROUTES.auth.register}`,
  login: `${URL}${ROUTES.auth.login}`,
  google: `${URL}${ROUTES.auth.google}`,
  logout: `${URL}${ROUTES.auth.logout}`,
  refresh: `${URL}${ROUTES.auth.refresh}`,
  me: `${URL}${ROUTES.auth.me}`,
  changePassword: `${URL}${ROUTES.auth.changePassword}`,
  deleteUser: `${URL}${ROUTES.auth.deleteUser}`,
  verifyEmail: (token: string) =>
    `${URL}${ROUTES.auth.verifyEmail}?token=${encodeURIComponent(token)}`,
} as const;

export const authKeys = {
  me: () => ['auth', 'me'] as const,
};

export const getUserQueryScope = (userId?: number | null) => userId ?? 'guest';
