import { describe, test, expect, beforeEach, vi } from 'vitest';
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

      await expect(notepadService.getNotepads()).rejects.toThrow(ERRORS.fetch);

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

      expect(responsePost).toStrictEqual({
        status: 409,
        message: `A notebook with the title ${MOCK_TITLE_EXISTING} already exists`,
      });
    });

    test('return error if network problem', async () => {
      testState.forceError = true;

      await expect(
        notepadService.createNotepad(MOCK_TITLE_NON_EXISTING),
      ).rejects.toThrow(ERRORS.fetch);

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
      ).rejects.toThrow(ERRORS.fetch);

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
        ERRORS.fetch,
      );

      testState.forceError = false;
    });
  });
});
