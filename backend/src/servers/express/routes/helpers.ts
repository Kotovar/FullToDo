import type { Request } from 'express';
import type { TaskQueryParams } from '@sharedCommon/schemas';
import { validateTaskQueryParams } from '@controllers';

/**
 * Безопасно достает path-параметр из Express request.
 *
 * Express typings допускают `string | string[]`, поэтому helper нормализует
 * значение до строки. Если параметр отсутствует, возвращается пустая строка.
 */
export const param = (req: Request, key: string) => {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : (value ?? '');
};

/**
 * Валидирует query-параметры списка задач из Express request.
 *
 * Сама логика валидации общая для HTTP и Express адаптеров, здесь остается
 * только преобразование `req.query` в объект строковых параметров.
 */
export const getValidatedTaskParams = (req: Request): TaskQueryParams => {
  const rawParams = Object.fromEntries(
    Object.entries(req.query).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  );

  return validateTaskQueryParams(rawParams);
};
