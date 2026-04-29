import {
  taskQueryParamsSchema,
  type TaskQueryParams,
} from '@sharedCommon/schemas';
import { extractInvalidKeys } from '@sharedCommon/utils';

/**
 * Валидирует query-параметры задач.
 *
 * Корректные параметры применяются, неизвестные или невалидные отбрасываются,
 * а отсутствующие значения заполняются дефолтами из Zod-схемы.
 */
export const validateTaskQueryParams = (
  rawParams: Record<string, string>,
): TaskQueryParams => {
  const validation = taskQueryParamsSchema.safeParse(rawParams);

  if (validation.success) {
    return validation.data;
  }

  const invalidKeys = extractInvalidKeys(validation.error);
  const validParams = Object.fromEntries(
    Object.entries(rawParams).filter(([key]) => !invalidKeys.includes(key)),
  );

  return taskQueryParamsSchema.parse(validParams);
};
