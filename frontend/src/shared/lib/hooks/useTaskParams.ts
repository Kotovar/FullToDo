import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { taskQueryParamsSchema } from 'shared/schemas';
import { extractInvalidKeys } from 'shared/utils';

export const useTaskParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { validParams } = useMemo(() => {
    const validation = taskQueryParamsSchema.safeParse(
      Object.fromEntries(searchParams),
    );

    if (validation.success) {
      return { validParams: searchParams };
    }

    const paramsCopy = new URLSearchParams(searchParams);
    const invalidKeys = extractInvalidKeys(validation.error);

    invalidKeys.forEach(key => paramsCopy.delete(key));

    return { validParams: paramsCopy };
  }, [searchParams]);

  return { validParams, setSearchParams };
};
