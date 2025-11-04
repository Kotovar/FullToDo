import { useSearchParams } from 'react-router';
import { taskQueryParamsSchema } from 'shared/schemas';
import { extractInvalidKeys } from 'shared/utils';

export const useTaskParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const validation = taskQueryParamsSchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (validation.success) {
    return { validParams: searchParams, setSearchParams };
  } else {
    const validParams = new URLSearchParams(searchParams);
    const invalidKeys = extractInvalidKeys(validation.error);
    invalidKeys.forEach(key => validParams.delete(key));

    return { validParams, setSearchParams };
  }
};
