import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useLocalStorage, useMediaQuery } from 'usehooks-ts';
import { useDarkMode } from './useDarkMode';

const setDarkModeMock = vi.fn();
const removeDarkModeMock = vi.fn();

const getMocks = (media: boolean = true, local: boolean = true) => {
  vi.mocked(useMediaQuery).mockReturnValue(media);
  vi.mocked(useLocalStorage).mockReturnValue([
    local,
    setDarkModeMock,
    removeDarkModeMock,
  ]);
};

describe('useDarkMode', () => {
  vi.mock('usehooks-ts');

  test('dark theme on', () => {
    getMocks();

    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDarkMode).toBe(true);

    act(() => result.current.toggle());

    expect(setDarkModeMock).toBeCalled();
  });

  test('dark theme off', () => {
    getMocks(true, false);

    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDarkMode).toBe(false);

    act(() => result.current.toggle());

    expect(setDarkModeMock).toBeCalled();
  });
});
