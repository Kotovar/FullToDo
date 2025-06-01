import { renderHook } from '@testing-library/react';
import { createWrapper } from '@shared/mocks';
import { useFilterLabels } from './useFilterLabels';

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
      () =>
        useFilterLabels(new URLSearchParams('priority=undefined&unknown=123')),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current).toEqual([]);
  });
});
