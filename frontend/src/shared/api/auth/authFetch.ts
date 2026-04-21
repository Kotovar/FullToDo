import { getAccessToken } from './accessToken';
import { emitUnauthorizedSessionEvent } from './session';

type AuthFetchOptions = RequestInit & {
  withAuth?: boolean;
};

const AUTH_ROUTE_SEGMENT = '/auth/';

const getRequestUrl = (input: RequestInfo | URL) => {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
};

const isAuthRequest = (input: RequestInfo | URL) =>
  getRequestUrl(input).includes(AUTH_ROUTE_SEGMENT);

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
 * - позволяет отключить Bearer-заголовок для auth-эндпоинтов, которые
 *   работают без access token, например `login`, `register`, `refresh`, `logout`.
 *
 * Нужен как единая точка для auth-сетевых запросов, чтобы логика cookies
 * и access token не дублировалась по всему приложению.
 */
export const authFetch = async (
  input: RequestInfo | URL,
  { withAuth = true, headers, ...init }: AuthFetchOptions = {},
) => {
  const response = await fetch(input, {
    ...init,
    credentials: 'include',
    headers: buildAuthHeaders(headers, withAuth),
  });

  if (withAuth && response.status === 401 && !isAuthRequest(input)) {
    emitUnauthorizedSessionEvent();
  }

  return response;
};
