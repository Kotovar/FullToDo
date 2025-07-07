import type { FiltersState } from '@pages/Tasks/lib';
import type { SetURLSearchParams } from 'react-router';
import { getTypedKeys } from '@shared/lib';
import { useCallback } from 'react';

export const useFilters = (setParams: SetURLSearchParams) => {
  const handleRemoveFilter = useCallback(
    (key: string) => {
      setParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete(key);
        return newParams;
      });
    },
    [setParams],
  );

  const handleUpdateFilter = useCallback(
    (newFilters: FiltersState) => {
      setParams(prev => {
        const newParams = new URLSearchParams(prev);

        const filters = getTypedKeys(newFilters);

        filters.forEach(key => {
          const value = newFilters[key];
          if (value) {
            newParams.set(key, value);
          } else {
            newParams.delete(key);
          }
        });

        return newParams;
      });
    },
    [setParams],
  );

  return {
    handleRemoveFilter,
    handleUpdateFilter,
  };
};
