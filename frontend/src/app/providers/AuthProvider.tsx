import { useCallback, useEffect, useMemo, type PropsWithChildren } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authService,
  authKeys,
  clearAccessToken,
  fetchCurrentUser,
  getAccessToken,
  handleMutationError,
  resetGuestSession,
  subscribeToUnauthorizedSession,
} from '@shared/api';
import { AuthContext, type AuthContextValue } from './AuthContext';
import type { PublicUser } from 'shared/schemas';

/**
 * Определяет, можно ли трактовать ошибку как отсутствие активной сессии гостя.
 *
 * @param error Ошибка из auth-запроса.
 * @returns `true`, если ошибка означает отсутствие авторизации или пользователя.
 */
const isGuestError = (error: unknown) => {
  const normalizedError = handleMutationError(error);

  return (
    normalizedError.type === 'UNAUTHORIZED' ||
    normalizedError.type === 'UNDEFINED'
  );
};

/**
 * Восстанавливает auth-сессию при старте приложения.
 * Сначала использует access token, а при необходимости пытается обновить его через refresh cookie.
 *
 * @returns Текущего пользователя или `null`, если сессии нет.
 */
const resolveCurrentUser = async (): Promise<PublicUser | null> => {
  const accessToken = getAccessToken();

  if (accessToken) {
    try {
      return await fetchCurrentUser();
    } catch (error) {
      if (!isGuestError(error)) {
        throw error;
      }
    }
  }

  try {
    await authService.refresh();
    return await fetchCurrentUser();
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
  const queryClient = useQueryClient();
  const { data, error, isError, isPending, refetch } = useQuery({
    queryKey: authKeys.me(),
    queryFn: resolveCurrentUser,
    retry: false,
  });

  useEffect(() => {
    const unsubscribe = subscribeToUnauthorizedSession(() => {
      void resetGuestSession(queryClient);
    });

    return unsubscribe;
  }, [queryClient]);

  const refetchUser = useCallback(async () => {
    const result = await refetch();
    return result.data;
  }, [refetch]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data ?? null,
      status: data ? 'user' : 'guest',
      isAuthenticated: Boolean(data),
      isError,
      error,
      refetchUser,
    }),
    [data, error, isError, refetchUser],
  );

  if (isPending) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
