import { renderHook, waitFor } from '@testing-library/react';
import { useNotepad } from './useNotepad';
import { createWrapperWithRouter } from '@shared/mocks';
import { ROUTES } from 'shared/routes';
import { notepadService } from '@entities/Notepad';
import { getUseNotificationsMock, setupMockServer } from '@shared/testing';
import { COMMON_NOTEPAD_ID, NOTEPAD_ID } from 'shared/schemas';

const getInitialData = async (isCommon: boolean = false) => {
  const { result } = renderHook(() => useNotepad(), {
    wrapper: createWrapperWithRouter(
      isCommon
        ? [ROUTES.tasks.base]
        : [`${ROUTES.notepads.base}/${NOTEPAD_ID}`],
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
    expect(result.current.notepadId).toBe(NOTEPAD_ID);
    expect(result.current.location).toBe(
      `${ROUTES.notepads.base}/${NOTEPAD_ID}`,
    );

    await waitFor(() => {
      expect(result.current.title).toBe('Рабочее');
    });
  });

  test('should return the shared notebook on the route', async () => {
    const result = await getInitialData(true);

    expect(result.current.location).toBe(ROUTES.tasks.base);
    expect(result.current.notepadId).toBe(COMMON_NOTEPAD_ID);

    await waitFor(() => {
      expect(result.current.title).toBe('Все задачи');
    });
  });

  test('should return empty data if notebook is not found', async () => {
    const { result } = renderHook(() => useNotepad(), {
      wrapper: createWrapperWithRouter([`${ROUTES.notepads.base}/999`]),
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
      expect(showError).toHaveBeenCalled();
    });
  });
});
