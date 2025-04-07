import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterAll } from 'vitest';
import { useVisibility } from './useVisibility';

describe('useVisibility', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    window.innerWidth = originalInnerWidth;
  });

  describe('Начальное состояние и handleVisibility', () => {
    test('возвращает начальное состояние isHidden как false', () => {
      const { result } = renderHook(() => useVisibility());
      expect(result.current[0]).toBe(false);
    });

    test('переключает isHidden при вызове handleVisibility', () => {
      const { result } = renderHook(() => useVisibility());

      act(() => result.current[1]());
      expect(result.current[0]).toBe(true);

      act(() => result.current[1]());
      expect(result.current[0]).toBe(false);
    });
  });

  describe('turnOffVisibility', () => {
    test('устанавливает isHidden в true для мобильных устройств (width < 768)', () => {
      window.innerWidth = 767;

      const { result } = renderHook(() => useVisibility());

      act(() => result.current[2]());
      expect(result.current[0]).toBe(true);
    });

    test('не изменяет isHidden для десктопов (width >= 768)', () => {
      window.innerWidth = 768;

      const { result } = renderHook(() => useVisibility());

      act(() => result.current[2]());

      expect(result.current[0]).toBe(false);
    });
  });
});
