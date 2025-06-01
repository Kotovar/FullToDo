import type { FiltersState } from '@pages/Tasks/lib';
import type { SetURLSearchParams } from 'react-router';

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

      (Object.keys(newFilters) as Array<keyof FiltersState>).forEach(key => {
        const value = newFilters[key];
        if (value !== undefined && value) {
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
