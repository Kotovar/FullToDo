import { act, renderHook } from '@testing-library/react';
import { useSort } from './useSort';
import { createWrapper } from '@shared/mocks';

const mockSetParams = vi.fn();
const mockParams = new URLSearchParams('sortBy=createdDate&order=asc');
const mockParamsWithoutOrder = new URLSearchParams('sortBy=createdDate');
const mockEmptyParams = new URLSearchParams();

const getInitialData = async () => {
  const { result } = renderHook(() => useSort(mockParams, mockSetParams), {
    wrapper: createWrapper(),
  });

  return result;
};

describe('useSort', () => {
  test('toggleOrder', async () => {
    const result = await getInitialData();

    act(() => {
      result.current.toggleOrder();
    });

    const updateFn: (params: URLSearchParams) => URLSearchParams =
      mockSetParams.mock.calls[0][0];

    const newParamsWithoutOrder = updateFn(mockParamsWithoutOrder);
    expect(newParamsWithoutOrder.get('order')).toBe('asc');

    act(() => {
      result.current.toggleOrder();
    });

    const newParams = updateFn(mockParams);
    expect(newParams.get('sortBy')).not.toBeNull();
    expect(newParams.get('order')).toBe('desc');

    act(() => {
      result.current.toggleOrder();
    });

    const emptyParams = updateFn(mockEmptyParams);
    expect(emptyParams.get('sortBy')).toBeNull();
  });

  test('updateSort', async () => {
    const result = await getInitialData();

    act(() => {
      result.current.updateSort('createdDate');
    });

    const updateFn: (params: URLSearchParams) => URLSearchParams =
      mockSetParams.mock.calls[0][0];

    const newParams = updateFn(mockEmptyParams);
    expect(newParams.get('sortBy')).toBe('createdDate');
  });
});
