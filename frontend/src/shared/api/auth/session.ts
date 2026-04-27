import { authKeys } from '../entities/Auth.query.config';
import { clearAccessToken } from './accessToken';
import type { QueryClient } from '@tanstack/react-query';

const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';
const USER_SCOPED_QUERY_KEYS = new Set(['notepads', 'tasks', 'task']);

const isUserScopedQuery = (queryKey: readonly unknown[]) =>
  USER_SCOPED_QUERY_KEYS.has(String(queryKey.at(0) ?? ''));

/**
 * Сбрасывает клиентскую auth-сессию до состояния гостя.
 *
 * Что делает:
 * - очищает in-memory access token;
 * - отменяет активные user-scoped queries;
 * - записывает `null` в кэш текущего пользователя;
 * - удаляет из React Query кэш задач, блокнотов и деталей задачи.
 *
 * @param queryClient Экземпляр React Query client текущего приложения.
 */
export const resetGuestSession = async (queryClient: QueryClient) => {
  clearAccessToken();

  await queryClient.cancelQueries({
    predicate: query => isUserScopedQuery(query.queryKey),
  });

  queryClient.setQueryData(authKeys.me(), null);
  queryClient.removeQueries({
    predicate: query => isUserScopedQuery(query.queryKey),
  });
};

/**
 * Отправляет глобальное браузерное событие о том, что текущая сессия
 * стала невалидной из-за `401 Unauthorized`.
 *
 * Нужен как общий сигнал между сетевым слоем и `AuthProvider`,
 * чтобы централизованно перевести приложение в guest-state.
 */
export const emitUnauthorizedSessionEvent = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
};

/**
 * Подписывает обработчик на глобальное событие невалидной auth-сессии.
 *
 * @param listener Функция, которая должна выполниться при получении сигнала
 * о `401 Unauthorized`.
 * @returns Функцию отписки от события.
 */
export const subscribeToUnauthorizedSession = (listener: () => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(AUTH_UNAUTHORIZED_EVENT, listener);

  return () => {
    window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, listener);
  };
};
