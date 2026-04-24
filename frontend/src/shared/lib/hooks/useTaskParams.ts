import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { taskQueryParamsSchema } from 'shared/schemas';
import { extractInvalidKeys } from 'shared/utils';

const sanitizeTaskParams = (searchParams: URLSearchParams) => {
  const validation = taskQueryParamsSchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (validation.success) {
    return searchParams;
  }

  const validParams = new URLSearchParams(searchParams);
  const invalidKeys = extractInvalidKeys(validation.error);
  invalidKeys.forEach(key => validParams.delete(key));

  return validParams;
};

/**
 * Возвращает query-параметры задач в нормализованном виде.
 *
 * Хук читает параметры из URL, валидирует их через `taskQueryParamsSchema`
 * и отбрасывает невалидные ключи, чтобы код работал только
 * с допустимым набором `search/page/sort/filter` значений.
 */
export const useTaskParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const validParams = useMemo(
    () => sanitizeTaskParams(searchParams),
    [searchParams],
  );

  return { validParams, setSearchParams };
};
