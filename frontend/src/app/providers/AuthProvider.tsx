import { useCallback, useMemo, type PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { PublicUser } from 'shared/schemas';
import {
  authService,
  clearAccessToken,
  getAccessToken,
  handleMutationError,
} from '@shared/api';
import { AuthContext, type AuthContextValue } from './AuthContext';

const AUTH_QUERY_KEY = ['auth', 'me'] as const;

const isGuestError = (error: unknown) => {
  const normalizedError = handleMutationError(error);

  return (
    normalizedError.type === 'UNAUTHORIZED' ||
    normalizedError.type === 'UNDEFINED'
  );
};

const getCurrentUser = async () => {
  const { user } = await authService.me();
  return user;
};

const resolveCurrentUser = async (): Promise<PublicUser | null> => {
  const accessToken = getAccessToken();

  if (accessToken) {
    try {
      return await getCurrentUser();
    } catch (error) {
      if (!isGuestError(error)) {
        throw error;
      }
    }
  }

  try {
    await authService.refresh();
    return await getCurrentUser();
  } catch (error) {
    if (isGuestError(error)) {
      clearAccessToken();
      return null;
    }

    throw error;
  }
};

/** Инициализирует auth-сессию при старте приложения и делает её доступной через контекст. */
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data, error, isError, isPending, refetch } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: resolveCurrentUser,
    retry: false,
  });

  const refetchUser = useCallback(async () => {
    const result = await refetch();
    return result.data;
  }, [refetch]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data ?? null,
      status: isPending ? 'loading' : data ? 'user' : 'guest',
      isAuthenticated: Boolean(data),
      isLoading: isPending,
      isError,
      error,
      refetchUser,
    }),
    [data, error, isError, isPending, refetchUser],
  );

  if (isPending) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
