import { renderHook } from '@testing-library/react';
import { createWrapper } from '@shared/mocks';
import {
  useFilterLabels,
  getTranslationKey,
  FilterValue,
} from './useFilterLabels';

const mockParams = new URLSearchParams('isCompleted=true&unknown=123');

const getInitialData = async () => {
  const { result } = renderHook(() => useFilterLabels(mockParams), {
    wrapper: createWrapper(),
  });

  return result;
};

describe('useFilterLabels', () => {
  test('successful', async () => {
    const result = await getInitialData();
    expect(result.current).toEqual([
      { key: 'isCompleted', label: 'Выполненные', value: 'true' },
    ]);
  });

  test('emptyResponse', async () => {
    const { result } = renderHook(
      () => useFilterLabels(new URLSearchParams('unknown=123')),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current).toEqual([]);
  });
});

describe('getTranslationKey', () => {
  test('getTranslationKey - isCompleted', async () => {
    expect(getTranslationKey('isCompleted', 'true')).toBe(
      'filters.labels.isCompleted.true',
    );
  });

  test('getTranslationKey - isCompleted - error', () => {
    expect(() =>
      getTranslationKey('isCompleted', 'low' as FilterValue<'isCompleted'>),
    ).toThrowError('Invalid filter combination: isCompleted.low');
  });

  test('getTranslationKey - hasDueDate', () => {
    expect(getTranslationKey('hasDueDate', 'true')).toBe(
      'filters.labels.hasDueDate.true',
    );
  });

  test('getTranslationKey - hasDueDate - error', () => {
    expect(() =>
      getTranslationKey('hasDueDate', 'low' as FilterValue<'hasDueDate'>),
    ).toThrowError(`Invalid filter combination: hasDueDate.low`);
  });
});
