import { act, renderHook } from '@testing-library/react';
import { createWrapper } from '@shared/mocks';
import { useMenuToggle } from './useMenuToggle';

describe('useMenuToggle', () => {
  test('opens menu below when there is enough space below the button', () => {
    const button = document.createElement('button');

    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 500,
      right: 0,
      bottom: 540,
      left: 0,
      width: 40,
      height: 40,
      toJSON: () => ({}),
    });

    const { result } = renderHook(() => useMenuToggle({ path: '/test' }), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.menuMethods.toggleMenu(button);
    });

    expect(result.current.menuPosition).toBe('bottom');
    expect(result.current.isCurrentMenuOpen).toBe(true);
  });

  test('opens menu above when there is not enough space below, but enough above', () => {
    const button = document.createElement('button');

    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 300,
      right: 0,
      bottom: window.innerHeight - 40,
      left: 0,
      width: 40,
      height: 40,
      toJSON: () => ({}),
    });

    const { result } = renderHook(() => useMenuToggle({ path: '/test' }), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.menuMethods.toggleMenu(button);
    });

    expect(result.current.menuPosition).toBe('top');
    expect(result.current.isCurrentMenuOpen).toBe(true);
  });
});
