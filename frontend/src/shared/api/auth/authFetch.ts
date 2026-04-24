import { authRoutes } from '../entities/Auth.query.config';
import { getAccessToken, setAccessToken } from './accessToken';
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

let refreshPromise: Promise<boolean> | null = null;

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
 * Выполняет auth запрос с cookie и опциональным Bearer access token.
 *
 * Используется как низкоуровневая обёртка поверх `fetch`, чтобы повторно
 * вызывать исходный запрос после успешного refresh без дублирования логики
 * сборки headers/credentials.
 */
const performAuthFetch = (
  input: RequestInfo | URL,
  { withAuth = true, headers, ...init }: AuthFetchOptions = {},
) =>
  fetch(input, {
    ...init,
    credentials: 'include',
    headers: buildAuthHeaders(headers, withAuth),
  });

/**
 * Обновляет access token через refresh cookie.
 *
 * Использует single-flight семантику: пока refresh уже выполняется,
 * последующие вызовы ожидают тот же самый `Promise`, а не создают новые
 * запросы к `/auth/refresh`.
 *
 * @returns `true`, если backend вернул новый access token и он сохранён в
 * in-memory хранилище, иначе `false`.
 */
const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const response = await performAuthFetch(authRoutes.refresh, {
      method: 'POST',
      withAuth: false,
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { accessToken?: string };

    if (!data.accessToken) {
      return false;
    }

    setAccessToken(data.accessToken);
    return true;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
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
  const response = await performAuthFetch(input, {
    withAuth,
    headers,
    ...init,
  });

  if (withAuth && response.status === 401 && !isAuthRequest(input)) {
    const isRefreshed = await refreshAccessToken();

    if (isRefreshed) {
      return performAuthFetch(input, { withAuth, headers, ...init });
    }

    emitUnauthorizedSessionEvent();
  }

  return response;
};
