import { COMMON_ERRORS, TASKS_ERRORS } from '@shared/api';
import { testState, setupMockServer } from '@shared/config';
import { taskService } from './Task.query';
import {
  getDeleteResponse,
  MOCK_SINGE_NOTEPAD_RESPONSE,
  MOCK_SINGE_NOTEPAD_RESPONSE_WITH_PARAMS,
  MOCK_SINGE_TASK_RESPONSE,
  MOCK_TASK_UPDATE_RESPONSE,
  MOCK_TITLE_EXISTING,
  MOCK_TITLE_EXISTING_NOTEPAD,
  MOCK_TITLE_NON_EXISTING,
} from '@shared/mocks';
import {
  getErrorMock,
  getErrorResult,
  getFailFetchResponse,
} from '@shared/testing';
import { commonNotepadId, notepadId, taskId } from 'shared/schemas';

describe('MockTaskService', () => {
  setupMockServer();

  beforeEach(() => {
    vi.resetModules();
  });

  const emptyParams = new URLSearchParams();
  const params = new URLSearchParams('search=task');

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

  describe('handleResponse', () => {
    test('should handle 409 conflict error', async () => {
      const fetchSpy = getFailFetchResponse(409);

      await expect(
        taskService.createTask({ title: MOCK_TITLE_NON_EXISTING }, notepadId),
      ).rejects.toThrowError(
        expect.objectContaining({
          message: 'Conflict',
          cause: TASKS_ERRORS.CONFLICT,
        }),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    test('should handle 404 Not found error', async () => {
      const fetchSpy = getFailFetchResponse(404);

      await expect(
        taskService.createTask({ title: MOCK_TITLE_NON_EXISTING }, notepadId),
      ).rejects.toThrowError(
        expect.objectContaining({
          message: 'Not found',
          cause: TASKS_ERRORS.UNDEFINED,
        }),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleError', () => {
    test('should throw error if error instanceof Error && error.cause', async () => {
      const fetchSpy = getErrorMock(true);

      await expect(
        taskService.createTask({ title: MOCK_TITLE_NON_EXISTING }, notepadId),
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
        taskService.createTask({ title: MOCK_TITLE_NON_EXISTING }, notepadId),
      ).rejects.toThrowError(
        expect.objectContaining(getErrorResult(TASKS_ERRORS)),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSingleTask', () => {
    test('success with notepadId', async () => {
      const responseGet = await taskService.getSingleTask(taskId, notepadId);
      expect(responseGet).toEqual(MOCK_SINGE_TASK_RESPONSE);
    });

    test('success without notepadId', async () => {
      const responseGet = await taskService.getSingleTask(taskId);
      expect(responseGet).toEqual(MOCK_SINGE_TASK_RESPONSE);
    });

    test('return handleError if catch error', async () => {
      const fetchSpy = getErrorMock();

      await expect(
        taskService.getSingleTask(notepadId, taskId),
      ).rejects.toThrowError(
        expect.objectContaining(getErrorResult(TASKS_ERRORS)),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTasksFromNotepad', () => {
    test('success with notepadId', async () => {
      const responseGet = await taskService.getTasksFromNotepad(
        notepadId,
        emptyParams,
      );
      expect(responseGet).toEqual(MOCK_SINGE_NOTEPAD_RESPONSE);
    });

    test('success with empty notepadId', async () => {
      const responseGet = await taskService.getTasksFromNotepad(
        '',
        emptyParams,
      );
      expect(responseGet).toEqual(MOCK_SINGE_NOTEPAD_RESPONSE);
    });

    test('success with common notepadId', async () => {
      const responseGet = await taskService.getTasksFromNotepad(
        commonNotepadId,
        emptyParams,
      );
      expect(responseGet).toEqual(MOCK_SINGE_NOTEPAD_RESPONSE);
    });

    test('success with  params', async () => {
      const responseGet = await taskService.getTasksFromNotepad(
        notepadId,
        params,
      );
      expect(responseGet).toEqual(MOCK_SINGE_NOTEPAD_RESPONSE_WITH_PARAMS);
    });

    test('should throw error if error in not instanceof Error', async () => {
      const fetchSpy = getErrorMock();

      await expect(
        taskService.getTasksFromNotepad(notepadId, params),
      ).rejects.toThrowError(
        expect.objectContaining(getErrorResult(TASKS_ERRORS)),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllTasks', () => {
    test('success', async () => {
      const responseGet = await taskService.getAllTasks(emptyParams);
      expect(responseGet).toEqual(MOCK_SINGE_NOTEPAD_RESPONSE);
    });

    test('success with  params', async () => {
      const responseGet = await taskService.getAllTasks(params);
      expect(responseGet).toEqual(MOCK_SINGE_NOTEPAD_RESPONSE_WITH_PARAMS);
    });

    test('should throw error if error in not instanceof Error', async () => {
      const fetchSpy = getErrorMock();

      await expect(taskService.getAllTasks(emptyParams)).rejects.toThrowError(
        expect.objectContaining(getErrorResult(TASKS_ERRORS)),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
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

    test('success without notepadId', async () => {
      const responsePost = await taskService.createTask({
        title: MOCK_TITLE_NON_EXISTING,
      });

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
  });

  describe('updateTask', () => {
    test('success', async () => {
      const responsePost = await taskService.updateTask(taskId, {
        title: MOCK_TITLE_NON_EXISTING,
      });

      expect(responsePost).toStrictEqual(MOCK_TASK_UPDATE_RESPONSE);
    });

    test('return error if title exists', async () => {
      const responsePost = await taskService.updateTask(taskId, {
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
        taskService.updateTask(taskId, {
          title: MOCK_TITLE_NON_EXISTING,
        }),
      ).rejects.toThrow('Server error');

      testState.forceError = false;
    });

    test('should throw error if error in not instanceof Error', async () => {
      const fetchSpy = getErrorMock();

      await expect(
        taskService.updateTask(taskId, {
          title: MOCK_TITLE_NON_EXISTING,
        }),
      ).rejects.toThrowError(
        expect.objectContaining(getErrorResult(TASKS_ERRORS)),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTask', () => {
    test('success', async () => {
      const responseDelete = await taskService.deleteTask(taskId);
      expect(responseDelete).toStrictEqual(getDeleteResponse('Task'));
    });

    test('should throw error if error in not instanceof Error', async () => {
      const fetchSpy = getErrorMock();

      await expect(taskService.deleteTask(taskId)).rejects.toThrowError(
        expect.objectContaining(getErrorResult(TASKS_ERRORS)),
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
