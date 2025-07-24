import { useLocation, useNavigate } from 'react-router';
import { renderHook, act } from '@testing-library/react';
import { createWrapper } from '@shared/mocks';
import { useBackNavigate } from './useBackNavigate';
import { ROUTES } from 'shared/routes';

vi.mock('react-router', () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}));

describe('useBackNavigate', () => {
  const mockNavigate = vi.fn();
  const mockUseLocation = vi.mocked(useLocation);
  const notepadId = '1';
  const taskId = '2';
  const defaultValue = {
    state: null,
    key: '',
    search: '',
    hash: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    mockUseLocation.mockReturnValue({
      pathname: '',
      state: null,
      key: '',
      search: '',
      hash: '',
    });
  });

  test('should navigate to tasks when path is tasks/[id]', () => {
    mockUseLocation.mockReturnValue({
      ...defaultValue,
      pathname: 'tasks/all',
    });

    const { result } = renderHook(() => useBackNavigate(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current();
    });

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TASKS);
  });

  test('should navigate to tasks when path is notepads/[id]/tasks/[id]', () => {
    mockUseLocation.mockReturnValue({
      ...defaultValue,
      pathname: `notepads/${notepadId}/tasks/${taskId}`,
    });

    const { result } = renderHook(() => useBackNavigate(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current();
    });

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.getNotepadPath(notepadId));
  });
});
