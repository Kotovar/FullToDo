import { renderHook } from '@testing-library/react';
import { useDarkMode } from '@shared/lib';
import { useDarkToast } from './useDarkToast';

describe('useDarkToast', () => {
  vi.mock('@shared/lib');

  test('should returns the correct class for toast', () => {
    vi.mocked(useDarkMode).mockReturnValue({
      isDarkMode: true,
      toggle: vi.fn(),
      fill: '',
    });

    const { result } = renderHook(() => useDarkToast());
    expect(result.current.theme).toBe('dark');
  });
});
