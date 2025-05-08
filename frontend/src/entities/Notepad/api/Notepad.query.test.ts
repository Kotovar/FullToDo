import {
  MOCK_NOTEPADS_RESPONSE,
  MOCK_TITLE_EXISTING,
  MOCK_NOTEPADS_UPDATE_RESPONSE,
  MOCK_TITLE_NON_EXISTING,
  getDeleteResponse,
  notepadId,
} from '@shared/mocks';
import { COMMON_ERRORS, NOTEPAD_ERRORS } from '@shared/api';
import { testState, setupMockServer } from '@shared/config';
import { notepadService } from './Notepad.query';
import {
  getErrorMock,
  getErrorResult,
  getFailFetchResponse,
} from '@shared/testing';

describe('MockNotepadService', () => {
  setupMockServer();

  beforeEach(() => {
    vi.resetModules();
  });

  describe('URL', () => {
    test('get error, if URL is not defined', async () => {
      vi.doMock('@shared/api', () => ({
        URL: undefined,
        COMMON_ERRORS: COMMON_ERRORS,
      }));

      await expect(import('./Notepad.query')).rejects.toThrow(
        COMMON_ERRORS.URL.message,
      );
    });
  });

  describe('handleResponse', () => {
    test('should handle 409 conflict error', async () => {
      const fetchSpy = getFailFetchResponse(409);

      await expect(
        notepadService.createNotepad(MOCK_TITLE_EXISTING),
      ).rejects.toThrowError(
        expect.objectContaining({
          message: 'Conflict',
          cause: NOTEPAD_ERRORS.CONFLICT,
        }),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    test('should handle 404 Not found error', async () => {
      const fetchSpy = getFailFetchResponse(404);

      await expect(
        notepadService.createNotepad(MOCK_TITLE_EXISTING),
      ).rejects.toThrowError(
        expect.objectContaining({
          message: 'Not found',
          cause: NOTEPAD_ERRORS.UNDEFINED,
        }),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    test('should handle default error', async () => {
      const fetchSpy = getFailFetchResponse(500);

      await expect(
        notepadService.createNotepad(MOCK_TITLE_EXISTING),
      ).rejects.toThrowError(
        expect.objectContaining({
          message: 'Server error',
          cause: NOTEPAD_ERRORS.SERVER_ERROR,
        }),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleError', () => {
    test('should throw error if error instanceof Error && error.cause', async () => {
      const fetchSpy = getErrorMock(true);

      await expect(
        notepadService.createNotepad(MOCK_TITLE_EXISTING),
      ).rejects.toThrowError(
        expect.objectContaining({
          message: 'Failed to fetch',
          cause: 'Error',
        }),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    test('should throw error if error in not instanceof Error', async () => {
      const fetchSpy = getErrorMock();

      await expect(
        notepadService.createNotepad(MOCK_TITLE_EXISTING),
      ).rejects.toThrowError(
        expect.objectContaining(getErrorResult(NOTEPAD_ERRORS)),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getNotepads', () => {
    test('success', async () => {
      const responseGet = await notepadService.getNotepads();
      expect(responseGet).toStrictEqual(MOCK_NOTEPADS_RESPONSE);
    });

    test('return error if network problem', async () => {
      testState.forceError = true;

      await expect(notepadService.getNotepads()).rejects.toThrow(
        COMMON_ERRORS.JSON.message,
      );

      testState.forceError = false;
    });
  });

  describe('createNotepad', () => {
    test('success', async () => {
      const responsePost = await notepadService.createNotepad(
        MOCK_TITLE_NON_EXISTING,
      );

      expect(responsePost).toStrictEqual({
        status: 201,
        message: `A notebook with the title ${MOCK_TITLE_NON_EXISTING} has been successfully created`,
      });
    });

    test('return error if title exists', async () => {
      const responsePost =
        await notepadService.createNotepad(MOCK_TITLE_EXISTING);

      expect(responsePost.status).toBe(409);
      expect(responsePost.message).toBe(
        'A notebook with the title EXISTING already exists',
      );
    });
  });

  describe('updateNotepad', () => {
    test('success', async () => {
      const responsePatch = await notepadService.updateNotepad(notepadId, {
        title: MOCK_TITLE_NON_EXISTING,
      });

      expect(responsePatch).toStrictEqual(MOCK_NOTEPADS_UPDATE_RESPONSE);
    });

    test('return error if title exists', async () => {
      const responsePost = await notepadService.updateNotepad(notepadId, {
        title: MOCK_TITLE_EXISTING,
      });

      expect(responsePost).toStrictEqual({
        status: 409,
        message: `The title ${MOCK_TITLE_EXISTING} is already in use`,
      });
    });

    test('return handleError if catch error', async () => {
      const fetchSpy = getErrorMock();

      await expect(
        notepadService.updateNotepad(notepadId, {
          title: MOCK_TITLE_EXISTING,
        }),
      ).rejects.toThrowError(
        expect.objectContaining(getErrorResult(NOTEPAD_ERRORS)),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteNotepad', () => {
    test('success', async () => {
      const responseDelete = await notepadService.deleteNotepad(notepadId);
      expect(responseDelete).toStrictEqual(getDeleteResponse('Notepad'));
    });

    test('return handleError if catch error', async () => {
      const fetchSpy = getErrorMock();

      await expect(
        notepadService.deleteNotepad(notepadId),
      ).rejects.toThrowError(
        expect.objectContaining(getErrorResult(NOTEPAD_ERRORS)),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
