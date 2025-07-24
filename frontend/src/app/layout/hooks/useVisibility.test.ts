import { renderHook, act } from '@testing-library/react';
import { useVisibility } from './useVisibility';

const getInitialData = () => {
  const { result } = renderHook(() => useVisibility(), {});

  return result;
};

const WINDOW_INNER_WIDTH_MOBILE = 767;

describe('useVisibility', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    window.innerWidth = originalInnerWidth;
  });

  describe('Initial state and handleVisibility', () => {
    test('should return the initial state isHidden as false', () => {
      const result = getInitialData();

      expect(result.current[0]).toBe(false);
    });

    test('should toggle isHidden when calling handleVisibility', () => {
      const result = getInitialData();

      act(() => result.current[1]());
      expect(result.current[0]).toBe(true);

      act(() => result.current[1]());
      expect(result.current[0]).toBe(false);
    });
  });

  describe('turnOffVisibility', () => {
    test('should set isHidden to true for mobile devices (width < 768)', () => {
      window.innerWidth = WINDOW_INNER_WIDTH_MOBILE;

      const result = getInitialData();

      act(() => result.current[2]());
      expect(result.current[0]).toBe(true);
    });

    test('should not change isHidden for desktops (width >= 768)', () => {
      window.innerWidth = WINDOW_INNER_WIDTH_MOBILE + 1;

      const result = getInitialData();

      act(() => result.current[2]());
      expect(result.current[0]).toBe(false);
    });
  });
});
