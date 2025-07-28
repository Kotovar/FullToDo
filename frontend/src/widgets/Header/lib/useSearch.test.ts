import { act, renderHook } from '@testing-library/react';
import { createWrapperWithRouter } from '@shared/mocks';
import { useSearch } from './useSearch';
import * as useTaskParamsHook from '@entities/Task';

const mockParams = new URLSearchParams('search=123');
const mockParamsEmpty = new URLSearchParams('search=');

const getInitialData = async () => {
  const { result } = renderHook(() => useSearch(), {
    wrapper: createWrapperWithRouter(),
  });

  return result;
};

describe('useSearch', () => {
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(useTaskParamsHook, 'useTaskParams').mockReturnValue({
      validParams: mockParams,
      setSearchParams: mockSetSearchParams,
    });
  });

  test('successful type and clear value', async () => {
    const result = await getInitialData();
    expect(result.current.value).toBe('123');

    act(() => {
      result.current.onChange('test');
    });

    expect(result.current.value).toBe('test');
    expect(mockSetSearchParams).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

    const updateFn: (params: URLSearchParams) => URLSearchParams =
      mockSetSearchParams.mock.calls[0][0];

    const newParams = updateFn(mockParams);
    expect(newParams.has('search')).toBe(true);

    act(() => {
      result.current.onClear();
    });

    expect(result.current.value).toBe('');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(2);

    const clearUpdateFn: (params: URLSearchParams) => URLSearchParams =
      mockSetSearchParams.mock.calls[1][0];

    const updatedParams = clearUpdateFn(mockParamsEmpty);
    expect(updatedParams.has('search')).toBe(false);
  });
});
