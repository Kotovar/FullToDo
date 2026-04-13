import type { ZodError } from 'zod';
import type { IncomingMessage, ServerResponse } from 'http';
import {
  COMMON_NOTEPAD_ID,
  emailTokenSchema,
  taskQueryParamsSchema,
  type TaskQueryParams,
} from '@sharedCommon/schemas';
import { extractInvalidKeys } from '@sharedCommon/utils';
import { AppError } from '@errors/AppError';
import { repositoryLogger } from '@logger';
import { ROUTES } from '@sharedCommon/routes';
import { REFRESH_TOKEN_EXPIRES_S } from '@utils';

/**
 * Читает тело входящего запроса и парсит его как JSON.
 * @param req — входящий HTTP-запрос.
 * @returns Promise с распарсенными данными.
 * @throws Error если тело не является валидным JSON.
 */
export const parseJsonBody = (req: IncomingMessage): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON ' + error));
      }
    });

    req.on('error', reject);
  });
};

/**
 * Централизованный обработчик ошибок. Определяет HTTP-статус по типу ошибки,
 * логирует серверные ошибки (5xx) и отправляет JSON-ответ клиенту.
 * @param res — объект HTTP-ответа.
 * @param error — перехваченная ошибка (AppError или произвольный объект).
 */
export const errorHandler = (res: ServerResponse, error: unknown) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;

  if (statusCode >= 500) {
    repositoryLogger.error({ err: error }, 'Unhandled error');
  }

  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: error ?? 'Internal Server Error' }));
};

/**
 * Отправляет стандартный ответ 404 с JSON-сообщением о том, что маршрут не найден.
 * @param res — объект HTTP-ответа.
 */
export const handleNotFound = async (res: ServerResponse) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Route not found' }));
};

/**
 * Извлекает идентификаторы из URL запроса.
 *
 * Поддерживает два формата URL:
 * - `/tasks/:taskId` — общий блокнот (без notepadId в пути)
 * - `/notepads/:notepadId/tasks/:taskId` — задача конкретного блокнота
 *
 * @param req — входящий HTTP-запрос.
 * @param idType — `'notepad'` возвращает только `notepadId`, `'task'` возвращает оба идентификатора.
 */
export function getId(
  req: IncomingMessage,
  idType: 'notepad',
): { notepadId: string };
export function getId(
  req: IncomingMessage,
  idType: 'task',
): { notepadId: string; taskId: string };
export function getId(req: IncomingMessage, idType: 'notepad' | 'task') {
  const url = req.url?.split('/').filter(Boolean) ?? [];
  const isCommonPath = url[0] === 'tasks';

  const notepadId = isCommonPath ? COMMON_NOTEPAD_ID : (url[1] ?? '');
  const taskId = isCommonPath ? (url[1] ?? '') : (url[3] ?? '');

  return idType === 'notepad' ? { notepadId } : { notepadId, taskId };
}

/**
 * Парсит и валидирует query-параметры задач из URL запроса.
 * Невалидные параметры отбрасываются, остальные применяются поверх дефолтов.
 * @param req — входящий HTTP-запрос.
 * @returns Валидированные параметры пагинации `{ page, limit }`.
 */
export const getValidatedTaskParams = (
  req: IncomingMessage,
): TaskQueryParams => {
  const queryString = req.url?.split('?')[1] ?? '';
  if (!queryString) return { page: 1, limit: 10 };

  const params = new URLSearchParams(queryString);
  const rawParams = Object.fromEntries(params.entries());
  const validation = taskQueryParamsSchema.safeParse(rawParams);

  if (validation.success) {
    return validation.data;
  }

  const invalidKeys = extractInvalidKeys(validation.error);
  const validParams = filterValidParams(rawParams, invalidKeys);

  return taskQueryParamsSchema.parse(validParams);
};

/**
 * Фильтрует объект параметров, исключая ключи с невалидными значениями.
 * @param params — исходные query-параметры в виде строк.
 * @param badKeys — список ключей, которые нужно исключить.
 * @returns Частичный объект `TaskQueryParams` без невалидных ключей.
 */
const filterValidParams = (
  params: Record<string, string>,
  badKeys: string[],
): Partial<TaskQueryParams> =>
  Object.fromEntries(
    Object.entries(params).filter(([key]) => !badKeys.includes(key)),
  );

/**
 * Проверяет, что заголовок `Content-Type` запроса равен `application/json`.
 * Если нет — отправляет ответ 400 и возвращает `false`.
 * @param req — входящий HTTP-запрос.
 * @param res — объект HTTP-ответа.
 * @returns `true` если Content-Type корректный, иначе `false`.
 */
export const checkContentType = (
  req: IncomingMessage,
  res: ServerResponse,
): boolean => {
  if (req.headers['content-type'] !== 'application/json') {
    res.writeHead(400).end('Invalid Content-Type');
    return false;
  }
  return true;
};

/**
 * Отправляет ответ 400 с деталями ошибки валидации Zod.
 * @param res — объект HTTP-ответа.
 * @param error — объект ошибки Zod с описанием невалидных полей.
 */
export const handleValidationError = (res: ServerResponse, error: ZodError) => {
  res.writeHead(400, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      message: 'Invalid data',
      errors: error,
    }),
  );
};

/**
 * Формирует заголовки ответа с httpOnly-куки для refresh-токена.
 *
 * Флаг `Secure` добавляется только в production (требует HTTPS).
 * Путь ограничен `/auth`, чтобы куки не отправлялась на остальные маршруты.
 *
 * @param token - значение refresh-токена
 * @returns объект заголовков с `Content-Type` и `Set-Cookie`
 */
export const setRefreshCookie = (
  token: string,
  maxAge: number = REFRESH_TOKEN_EXPIRES_S,
) => {
  const secure = process.env.NODE_ENV === 'production' ? ' Secure;' : '';

  return {
    'Content-Type': 'application/json',
    'Set-Cookie': `refreshToken=${token}; HttpOnly;${secure} SameSite=Strict; Path=${ROUTES.auth.base}; Max-Age=${maxAge}`,
  };
};

/**
 * Парсит заголовок `Cookie` в объект ключ-значение.
 *
 * @param cookieHeader - значение заголовка `Cookie` из запроса (`req.headers.cookie`)
 * @returns объект вида `{ [name]: value }` или `{}`, если заголовок отсутствует
 *
 * @example
 * parseCookies('refreshToken=abc.def.ghi; theme=dark')
 * // { refreshToken: 'abc.def.ghi', theme: 'dark' }
 */
export const parseCookies = (cookieHeader?: string) => {
  if (!cookieHeader) return {};

  return Object.fromEntries(
    cookieHeader.split(';').map(cookie => {
      const [key, ...value] = cookie.trim().split('=');
      return [key, value.join('=')];
    }),
  );
};

/**
 * Извлекает и валидирует email-токен из query-параметров запроса.
 *
 * Ожидает URL вида `/verify-email?token=<jwt>`.
 *
 * @param req - входящий HTTP-запрос
 * @returns строку токена если он присутствует и валиден, иначе `null`
 */
export const getEmailToken = (req: IncomingMessage): string | null => {
  const queryString = req.url?.split('?')[1] ?? '';
  if (!queryString) return null;

  const params = new URLSearchParams(queryString);
  const rawParams = Object.fromEntries(params.entries());
  const validation = emailTokenSchema.safeParse(rawParams);

  return validation.success ? validation.data.token : null;
};
