import { renderHook } from '@testing-library/react';
import { useDarkMode } from '@shared/lib';
import { useDarkToast } from './useDarkToast';

describe('useDarkToast', () => {
  vi.mock('@shared/lib');

  test('возвращает правильный класс для toast', () => {
    vi.mocked(useDarkMode).mockReturnValue({
      isDarkMode: true,
      toggle: vi.fn(),
      fill: '',
    });

    const { result } = renderHook(() => useDarkToast());
    expect(result.current.toastClassName()).toBe(
      'relative flex p-4 min-h-10 rounded-md cursor-pointer border-1 text-dark bg-accent border-dark',
    );
  });
});
