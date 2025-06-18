import type { FiltersState } from '@pages/Tasks/lib';
import type { SetURLSearchParams } from 'react-router';
import { getTypedKeys } from '@shared/lib';

export const useFilters = (setParams: SetURLSearchParams) => {
  const handleRemoveFilter = (key: string) => {
    setParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete(key);
      return newParams;
    });
  };

  const handleUpdateFilter = (newFilters: FiltersState) => {
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
  };

  return {
    handleRemoveFilter,
    handleUpdateFilter,
  };
};
