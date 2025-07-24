import { renderHook, waitFor } from '@testing-library/react';
import {
  createWrapperWithRouter,
  getDeleteResponse,
  MOCK_NOTEPADS_RESPONSE,
  MOCK_TITLE_NON_EXISTING,
} from '@shared/mocks';
import { notepadService } from '@entities/Notepad';
import { useNotepads } from './useNotepads';
import { setupMockServer } from '@shared/testing';
import { notepadId } from 'shared/schemas';

const getInitialData = async () => {
  const { result } = renderHook(() => useNotepads(), {
    wrapper: createWrapperWithRouter(),
  });

  await waitFor(() => expect(result.current.isLoading).toBeFalsy());

  return result;
};

describe('useNotepads hook', () => {
  setupMockServer();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(notepadService, 'createNotepad').mockResolvedValue({
      status: 201,
      message: `A notebook with the title ${MOCK_TITLE_NON_EXISTING} has been successfully created`,
    });

    vi.spyOn(notepadService, 'updateNotepad').mockResolvedValue({
      status: 200,
      message: `A notepad with the id ${notepadId} has been successfully updated`,
    });

    vi.spyOn(notepadService, 'deleteNotepad').mockResolvedValue(
      getDeleteResponse('Notepad'),
    );
  });

  test('should show an error notification if one occurs', async () => {
    const mockError = new Error('Ошибка сервера');
    vi.spyOn(notepadService, 'createNotepad').mockRejectedValue(mockError);

    const result = await getInitialData();
    const success = await result.current.methods.createNotepad(
      MOCK_TITLE_NON_EXISTING,
    );

    expect(success).toBe(false);
    expect(notepadService.createNotepad).toHaveBeenCalledWith(
      MOCK_TITLE_NON_EXISTING,
    );
  });

  test('should return a list of notebooks', async () => {
    const result = await getInitialData();

    await waitFor(() =>
      expect(result.current.notepads).toEqual(MOCK_NOTEPADS_RESPONSE.data),
    );
  });

  test('createNotepad should be called when creating a notebook', async () => {
    const result = await getInitialData();
    result.current.methods.createNotepad(MOCK_TITLE_NON_EXISTING);

    await waitFor(() => {
      expect(notepadService.createNotepad).toHaveBeenCalledWith(
        MOCK_TITLE_NON_EXISTING,
      );
    });
  });

  test('updateNotepad should be called when changing the notebook name', async () => {
    const result = await getInitialData();
    result.current.methods.updateNotepadTitle(
      notepadId,
      MOCK_TITLE_NON_EXISTING,
    );

    await waitFor(() => {
      expect(notepadService.updateNotepad).toHaveBeenCalledWith(notepadId, {
        title: MOCK_TITLE_NON_EXISTING,
      });
    });
  });

  test('should call deleteNotepad when deleting a notepad', async () => {
    const result = await getInitialData();
    result.current.methods.deleteNotepad(notepadId);

    await waitFor(() => {
      expect(notepadService.deleteNotepad).toHaveBeenCalledWith(notepadId);
    });
  });
});
