import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from '@shared/lib/debounce';
import type { TaskSearch } from 'shared/schemas';
import { useTaskParams } from '@entities/Task';

export const useSearch = (debounceDelay: number = 300) => {
  const { validParams, setSearchParams } = useTaskParams();

  const getSearch = useCallback(() => {
    const { search }: TaskSearch = Object.fromEntries(validParams);
    return search ?? '';
  }, [validParams]);

  const [searchValue, setSearchValue] = useState(() => getSearch());

  useEffect(() => {
    setSearchValue(getSearch());
  }, [getSearch]);

  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          if (value) {
            newParams.set('search', value);
          } else {
            newParams.delete('search');
          }
          return newParams;
        });
      }, debounceDelay),
    [setSearchParams, debounceDelay],
  );

  const handleChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      debouncedUpdate(value);
    },
    [debouncedUpdate],
  );

  const handleClear = useCallback(() => {
    setSearchValue('');
    debouncedUpdate('');
  }, [debouncedUpdate]);

  return {
    value: searchValue,
    onChange: handleChange,
    onClear: handleClear,
  };
};
