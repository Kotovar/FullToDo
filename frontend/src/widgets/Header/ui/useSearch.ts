import { useCallback, useEffect, useRef, useState } from 'react';
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

  const debouncedUpdateRef = useRef(
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
  );

  const handleChange = useCallback((value: string) => {
    setSearchValue(value);
    debouncedUpdateRef.current(value);
  }, []);

  const handleClear = useCallback(() => {
    setSearchValue('');
    debouncedUpdateRef.current('');
  }, []);

  return {
    value: searchValue,
    onChange: handleChange,
    onClear: handleClear,
  };
};
