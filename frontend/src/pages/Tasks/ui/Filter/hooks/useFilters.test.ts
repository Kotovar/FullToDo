import { act, renderHook } from '@testing-library/react';
import { useFilters } from './useFilters';
import { createWrapper } from '@shared/mocks';

const mockSetParams = vi.fn();

const getInitialData = async () => {
  const { result } = renderHook(() => useFilters(mockSetParams), {
    wrapper: createWrapper(),
  });

  return result;
};

describe('useFilters', () => {
  const initialParams = new URLSearchParams();

  test('handleRemoveFilter', async () => {
    const result = await getInitialData();

    act(() => {
      result.current.handleRemoveFilter('isCompleted');
    });

    const updateFn: (params: URLSearchParams) => URLSearchParams =
      mockSetParams.mock.calls[0][0];
    const newParams = updateFn(initialParams);

    expect(newParams.get('isCompleted')).toBeNull();
  });

  test('handleUpdateFilter', async () => {
    const result = await getInitialData();

    act(() => {
      result.current.handleUpdateFilter({
        isCompleted: 'true',
        hasDueDate: '',
      });
    });

    const updateFn: (params: URLSearchParams) => URLSearchParams =
      mockSetParams.mock.calls[0][0];

    const newParams = updateFn(initialParams);

    expect(newParams.get('isCompleted')).toBe('true');
    expect(newParams.get('hasDueDate')).toBeNull();
  });
});
