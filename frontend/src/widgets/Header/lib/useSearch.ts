import { useCallback, useMemo, useState } from 'react';
import { debounce } from '@shared/lib/debounce';
import { useTaskParams } from '@shared/lib';

const setSearchParam = (params: URLSearchParams, value: string) => {
  const nextParams = new URLSearchParams(params);

  if (value) {
    nextParams.set('search', value);
  } else {
    nextParams.delete('search');
  }

  return nextParams;
};

/**
 * Управляет поисковой строкой задач с debounce-синхронизацией в URL.
 *
 * Хук хранит локальный draft ввода, а затем обновляет `search`
 * в query params, чтобы поиск переживал reload и навигацию назад/вперёд.
 */
export const useSearch = (debounceDelay: number = 300) => {
  const { validParams, setSearchParams } = useTaskParams();
  const [draftValue, setDraftValue] = useState<string | null>(null);
  const initialSearch = validParams.get('search') ?? '';

  const debouncedUpdate = useMemo(
    () =>
      debounce(
        (value: string) => setSearchParams(prev => setSearchParam(prev, value)),
        debounceDelay,
      ),
    [setSearchParams, debounceDelay],
  );

  const updateSearch = useCallback(
    (value: string) => {
      setDraftValue(value);
      debouncedUpdate(value);
    },
    [debouncedUpdate],
  );

  const isSearching = draftValue !== null && draftValue !== initialSearch;
  const value = isSearching ? draftValue : initialSearch;

  return {
    value,
    isSearching,
    onChange: updateSearch,
    onClear: () => updateSearch(''),
  };
};
