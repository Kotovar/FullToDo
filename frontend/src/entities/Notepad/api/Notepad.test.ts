import { describe, test, expect, beforeEach, vi } from 'vitest';
import { MOCK_NOTEPADS } from '@shared/mocks';
import { ERRORS } from '@shared/api';
import { notepadTestState, setupMockServer } from '@shared/config';
import { notepadService } from './Notepad.query';

describe('MockNotepadService', () => {
  setupMockServer();

  beforeEach(() => {
    vi.resetModules();
  });

  test('get error, if URL is not defined', async () => {
    vi.doMock('@shared/api', () => ({
      URL: undefined,
      ERRORS: ERRORS,
    }));

    await expect(import('./Notepad.query')).rejects.toThrow(ERRORS.url);
  });

  test('method getNotepads returns expected response', async () => {
    const responseGet = await notepadService.getNotepads();
    expect(responseGet).toStrictEqual(MOCK_NOTEPADS);

    notepadTestState.forceError = true;

    await expect(notepadService.getNotepads()).rejects.toThrow(ERRORS.network);

    notepadTestState.forceError = false;
  });
});
