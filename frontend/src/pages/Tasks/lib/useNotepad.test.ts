import { renderHook, waitFor } from '@testing-library/react';
import { useNotepad } from './useNotepad';
import { createWrapperWithRouter } from '@shared/mocks';
import { ROUTES } from 'shared/routes';
import { notepadService } from '@entities/Notepad';
import { getUseNotificationsMock, setupMockServer } from '@shared/testing';
import { commonNotepadId, notepadId } from 'shared/schemas';

const getInitialData = async (isCommon: boolean = false) => {
  const { result } = renderHook(() => useNotepad(), {
    wrapper: createWrapperWithRouter(
      isCommon ? [ROUTES.TASKS] : [`${ROUTES.NOTEPADS}/${notepadId}`],
    ),
  });
  await waitFor(() => expect(result.current).toBeDefined());

  return result;
};

describe('useNotepad hook', () => {
  setupMockServer();
  const showError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return a specific notebook along the route', async () => {
    const result = await getInitialData(false);
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    expect(result.current.notepadId).toBe(notepadId);
    expect(result.current.location).toBe(`${ROUTES.NOTEPADS}/${notepadId}`);

    await waitFor(() => {
      expect(result.current.title).toBe('Рабочее');
    });
  });

  test('should return the shared notebook on the route', async () => {
    const result = await getInitialData(true);

    expect(result.current.location).toBe(ROUTES.TASKS);
    expect(result.current.notepadId).toBe(commonNotepadId);

    await waitFor(() => {
      expect(result.current.title).toBe('Все задачи');
    });
  });

  test('should return empty data if notebook is not found', async () => {
    const { result } = renderHook(() => useNotepad(), {
      wrapper: createWrapperWithRouter([`${ROUTES.NOTEPADS}/999`]),
    });

    await waitFor(() => expect(result.current.isLoading).toBeTruthy());
    expect(result.current.notepadId).toBe('');
    expect(result.current.title).toBe('');

    await waitFor(() => {
      expect(result.current.notFound).toBe(true);
    });
  });

  test('showError should be called if an error is received', async () => {
    getUseNotificationsMock(showError);
    const mockError = new Error('Ошибка сервера');
    vi.spyOn(notepadService, 'getNotepads').mockRejectedValue(mockError);

    await getInitialData();

    await waitFor(() => {
      expect(showError).toBeCalled();
    });
  });
});
