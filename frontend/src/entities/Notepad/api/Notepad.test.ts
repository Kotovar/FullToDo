import {
  MOCK_NOTEPADS_RESPONSE,
  MOCK_TITLE_EXISTING,
  MOCK_NOTEPADS_UPDATE_RESPONSE,
  MOCK_TITLE_NON_EXISTING,
  getDeleteResponse,
  notepadId,
} from '@shared/mocks';
import { ERRORS } from '@shared/api';
import { testState, setupMockServer } from '@shared/config';
import { notepadService } from './Notepad.query';
import { waitFor } from '@testing-library/dom';

describe('MockNotepadService', () => {
  setupMockServer();

  beforeEach(() => {
    vi.resetModules();
  });

  describe('URL', () => {
    test('get error, if URL is not defined', async () => {
      vi.doMock('@shared/api', () => ({
        URL: undefined,
        ERRORS: ERRORS,
      }));

      await expect(import('./Notepad.query')).rejects.toThrow(ERRORS.url);
    });
  });

  describe('getNotepads', () => {
    test('success', async () => {
      const responseGet = await notepadService.getNotepads();
      expect(responseGet).toStrictEqual(MOCK_NOTEPADS_RESPONSE);
    });

    test('return error if network problem', async () => {
      testState.forceError = true;

      await expect(notepadService.getNotepads()).rejects.toThrow(ERRORS.json);

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

      expect(responsePost).toThrowError('Server error');

      // await waitFor(() =>
      //   expect(
      //     notepadService.createNotepad(MOCK_TITLE_NON_EXISTING),
      //   ).toStrictEqual({
      //     type: 'SERVER_ERROR',
      //     message: 'Некорректные данные',
      //   }),
      // );
    });

    test('return error if network problem', async () => {
      testState.forceError = true;

      await waitFor(() =>
        expect(
          notepadService.createNotepad(MOCK_TITLE_NON_EXISTING),
        ).toStrictEqual({
          type: 'CONFLICT',
          message: 'Блокнот с таким названием уже существует',
        }),
      );

      // await expect(
      //   notepadService.createNotepad(MOCK_TITLE_NON_EXISTING),
      // ).toStrictEqual({
      //   type: 'CONFLICT',
      //   message: 'Блокнот с таким названием уже существует',
      // });

      testState.forceError = false;
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

    test('return error if network problem', async () => {
      testState.forceError = true;

      await expect(
        notepadService.updateNotepad(notepadId, {
          title: MOCK_TITLE_NON_EXISTING,
        }),
      ).rejects.toThrow(ERRORS.server);

      testState.forceError = false;
    });
  });

  describe('deleteNotepad', () => {
    test('success', async () => {
      const responseDelete = await notepadService.deleteNotepad(notepadId);
      expect(responseDelete).toStrictEqual(getDeleteResponse('Notepad'));
    });

    test('return error if network problem', async () => {
      testState.forceError = true;

      await expect(notepadService.deleteNotepad(notepadId)).rejects.toThrow(
        ERRORS.server,
      );

      testState.forceError = false;
    });
  });
});
