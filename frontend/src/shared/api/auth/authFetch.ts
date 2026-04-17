import { getAccessToken } from './accessToken';

type AuthFetchOptions = RequestInit & {
  withAuth?: boolean;
};

/**
 * Формирует заголовки для auth-запросов.
 *
 * Если `withAuth = true` и в in-memory хранилище есть access token,
 * метод добавляет заголовок `Authorization: Bearer <token>`.
 *
 * Нужен для того, чтобы не собирать auth-заголовки вручную в каждом
 * запросе к защищённым backend-методам.
 */
export const buildAuthHeaders = (
  headers?: HeadersInit,
  withAuth = true,
): Headers => {
  const nextHeaders = new Headers(headers);
  const accessToken = getAccessToken();

  if (withAuth && accessToken) {
    nextHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  return nextHeaders;
};

/**
 * Обёртка над стандартным `fetch` для запросов, связанных с авторизацией.
 *
 * Что делает:
 * - всегда отправляет `credentials: 'include'`, чтобы браузер прикладывал
 *   HttpOnly cookie с refresh token;
 * - при `withAuth = true` добавляет Bearer access token в `Authorization`;
 * - позволяет отключить Bearer-заголовок для публичных auth-эндпоинтов
 *   вроде `login`, `register`, `refresh`, `logout`.
 *
 * Нужен как единая точка для auth-сетевых запросов, чтобы логика cookies
 * и access token не дублировалась по всему приложению.
 */
export const authFetch = (
  input: RequestInfo | URL,
  { withAuth = true, headers, ...init }: AuthFetchOptions = {},
) =>
  fetch(input, {
    ...init,
    credentials: 'include',
    headers: buildAuthHeaders(headers, withAuth),
  });
