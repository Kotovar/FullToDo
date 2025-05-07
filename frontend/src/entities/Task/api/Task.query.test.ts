import { COMMON_ERRORS } from '@shared/api';
import { testState, setupMockServer } from '@shared/config';
import { taskService } from './Task.query';
import {
  getDeleteResponse,
  MOCK_SINGE_NOTEPAD_RESPONSE,
  MOCK_SINGE_TASK_RESPONSE,
  MOCK_TASK_UPDATE_RESPONSE,
  MOCK_TITLE_EXISTING,
  MOCK_TITLE_EXISTING_NOTEPAD,
  MOCK_TITLE_NON_EXISTING,
  notepadId,
  taskId,
} from '@shared/mocks';

describe('MockTaskService', () => {
  setupMockServer();

  beforeEach(() => {
    vi.resetModules();
  });

  describe('URL', () => {
    test('get error, if URL is not defined', async () => {
      vi.doMock('@shared/api', () => ({
        COMMON_ERRORS: {
          URL: {
            message: COMMON_ERRORS.URL.message,
          },
        },
        URL: undefined,
      }));

      await expect(import('./Task.query')).rejects.toThrow(
        COMMON_ERRORS.URL.message,
      );
    });
  });

  describe('getSingleTask', () => {
    test('success', async () => {
      const responseGet = await taskService.getSingleTask(notepadId, taskId);
      expect(responseGet).toEqual(MOCK_SINGE_TASK_RESPONSE);
    });

    test('return error if network problem', async () => {
      testState.forceError = true;

      await expect(
        taskService.getSingleTask(notepadId, taskId),
      ).rejects.toThrow(COMMON_ERRORS.JSON.message);

      testState.forceError = false;
    });
  });

  describe('getTasksFromNotepad', () => {
    test('success', async () => {
      const responseGet = await taskService.getTasksFromNotepad(notepadId);
      expect(responseGet).toEqual(MOCK_SINGE_NOTEPAD_RESPONSE);
    });

    test('return error if network problem', async () => {
      testState.forceError = true;

      await expect(taskService.getTasksFromNotepad(notepadId)).rejects.toThrow(
        COMMON_ERRORS.JSON.message,
      );

      testState.forceError = false;
    });
  });

  describe('createTask', () => {
    test('success', async () => {
      const responsePost = await taskService.createTask(
        { title: MOCK_TITLE_NON_EXISTING },
        notepadId,
      );

      expect(responsePost).toStrictEqual({
        status: 201,
        message: `A task with the title ${MOCK_TITLE_NON_EXISTING} has been successfully created`,
      });
    });

    test('return error if title exists', async () => {
      const responsePost = await taskService.createTask(
        { title: MOCK_TITLE_EXISTING },
        notepadId,
      );

      expect(responsePost).toStrictEqual({
        status: 409,
        message: `A task with the title ${MOCK_TITLE_EXISTING} already exists in notepad ${MOCK_TITLE_EXISTING_NOTEPAD}`,
      });
    });

    test('return error if network problem', async () => {
      testState.forceError = true;

      await expect(
        taskService.createTask({ title: MOCK_TITLE_NON_EXISTING }, notepadId),
      ).rejects.toThrow('Server error');

      testState.forceError = false;
    });
  });

  describe('updateTask', () => {
    test('success', async () => {
      const responsePost = await taskService.updateTask(taskId, notepadId, {
        title: MOCK_TITLE_NON_EXISTING,
      });

      expect(responsePost).toStrictEqual(MOCK_TASK_UPDATE_RESPONSE);
    });

    test('return error if title exists', async () => {
      const responsePost = await taskService.updateTask(taskId, notepadId, {
        title: MOCK_TITLE_EXISTING,
      });

      expect(responsePost).toStrictEqual({
        status: 409,
        message: `A task with the title ${MOCK_TITLE_EXISTING} already exists in notepad ${MOCK_TITLE_EXISTING_NOTEPAD}`,
      });
    });

    test('return error if network problem', async () => {
      testState.forceError = true;

      await expect(
        taskService.updateTask(taskId, notepadId, {
          title: MOCK_TITLE_NON_EXISTING,
        }),
      ).rejects.toThrow('Server error');

      testState.forceError = false;
    });
  });

  describe('deleteTask', () => {
    test('success', async () => {
      const responseDelete = await taskService.deleteTask(notepadId, taskId);
      expect(responseDelete).toStrictEqual(getDeleteResponse('Task'));
    });

    test('return error if network problem', async () => {
      testState.forceError = true;

      await expect(taskService.deleteTask(notepadId, taskId)).rejects.toThrow(
        'Server error',
      );

      testState.forceError = false;
    });
  });
});
