import { renderHook, waitFor } from '@testing-library/react';
import { useNotepad } from './useNotepad';
import { setupMockServer } from '@shared/config';
import { createWrapperWithRouter, notepadId } from '@shared/mocks';
import { ROUTES } from 'shared/routes';

const getInitialData = async () => {
  const { result } = renderHook(() => useNotepad(), {
    wrapper: createWrapperWithRouter([ROUTES.getNotepadPath(notepadId)]),
  });

  await waitFor(() => expect(result.current.location).toBeDefined());

  return result;
};

describe('useNotepad hook', () => {
  setupMockServer();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('возвращает определённый блокнот по маршруту', async () => {
    const result = await getInitialData();

    expect(result.current.notepadId).toBe(notepadId);
    expect(result.current.location).toBe(ROUTES.getNotepadPath(notepadId));

    await waitFor(() => {
      expect(result.current.title).toBe('Рабочее');
    });
  });
});
