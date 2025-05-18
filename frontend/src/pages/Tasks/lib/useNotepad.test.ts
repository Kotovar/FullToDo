import { renderHook, waitFor } from '@testing-library/react';
import { useNotepad } from './useNotepad';
import { setupMockServer } from '@shared/config';
import { createWrapperWithRouter } from '@shared/mocks';
import { ROUTES } from 'shared/routes';
import { notepadService } from '@entities/Notepad';
import { getUseNotificationsMock } from '@shared/testing';
import { notepadId } from 'shared/schemas';

const getInitialData = async () => {
  const { result } = renderHook(() => useNotepad(), {
    wrapper: createWrapperWithRouter([`${ROUTES.NOTEPADS}/${notepadId}`]),
  });

  await waitFor(() => expect(result.current.location).toBeDefined());

  return result;
};

describe('useNotepad hook', () => {
  setupMockServer();
  const showError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('возвращает определённый блокнот по маршруту', async () => {
    const result = await getInitialData();

    expect(result.current.notepadId).toBe(notepadId);
    expect(result.current.location).toBe(`${ROUTES.NOTEPADS}/${notepadId}`);

    await waitFor(() => {
      expect(result.current.title).toBe('Рабочее');
    });
  });

  test('Если получена ошибка, вызывается showError', async () => {
    getUseNotificationsMock(showError);
    const mockError = new Error('Ошибка сервера');
    vi.spyOn(notepadService, 'getNotepads').mockRejectedValue(mockError);

    await getInitialData();

    await waitFor(() => {
      expect(showError).toBeCalled();
    });
  });
});
