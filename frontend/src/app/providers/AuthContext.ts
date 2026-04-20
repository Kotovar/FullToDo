import { createContext } from 'react';
import type { PublicUser } from 'shared/schemas';

export type AuthStatus = 'guest' | 'user';

export type AuthContextValue = {
  user: PublicUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isError: boolean;
  error: unknown;
  refetchUser: () => Promise<PublicUser | null | undefined>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
