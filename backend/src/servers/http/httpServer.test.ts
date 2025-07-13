import request from 'supertest';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ROUTES } from '@sharedCommon/routes';
import {
  type NotepadResponse,
  type TaskResponse,
  createNotepadSchema,
  createTaskSchema,
  notepadId,
  taskId,
} from '@sharedCommon/schemas';
import { taskRepository } from '@repositories';
import {
  validNotepadWithoutTasksData,
  validTaskData,
  validTasksData,
} from '@db/mock';
import { createHttpServer, extractPath } from './httpServer';
import { ZodError } from 'zod';

const port = 3000;
const server = createHttpServer();
const internalError = new Error('Internal Server Error');
const validationErrorMessage = 'Invalid data';

type MockZodError = ZodError<{ title: string }>;

describe('httpServer start/close', () => {
  test('should start and stop the server', async () => {
    server.listen(port);
    expect(server.listening).toBe(true);

    server.close();
    expect(server.listening).toBe(false);
  });
});

describe('extractPath', () => {
  test('returns undefined if url is undefined', () => {
    expect(extractPath(undefined)).toBeUndefined();
  });
});

describe('httpServer GET', () => {
  beforeEach(() => {
    server.listen(port);
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.close();
  });

  test('should handle GET /tasks', async () => {
    vi.spyOn(taskRepository, 'getAllTasks').mockResolvedValue(validTasksData);

    const response = await request(server).get(ROUTES.TASKS);
    expect(JSON.stringify(response.body)).toEqual(
      JSON.stringify(validTasksData),
    );
  });

  test('should return 500 if an internal server error occurs - /tasks', async () => {
    vi.spyOn(taskRepository, 'getAllTasks').mockRejectedValue(internalError);

    const response = await request(server)
      .get(ROUTES.TASKS)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: {} });
  });

  test('should handle GET /notepads', async () => {
    vi.spyOn(taskRepository, 'getAllNotepads').mockResolvedValue(
      validNotepadWithoutTasksData,
    );

    const response = await request(server).get(ROUTES.NOTEPADS);
    expect(response.body).toEqual(validNotepadWithoutTasksData);
  });

  test('should return 500 if an internal server error occurs - /notepads', async () => {
    vi.spyOn(taskRepository, 'getAllNotepads').mockRejectedValue(internalError);

    const response = await request(server)
      .get(ROUTES.NOTEPADS)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: {} });
  });

  test(`should handle GET /notepads/${notepadId}`, async () => {
    vi.spyOn(taskRepository, 'getSingleNotepadTasks').mockResolvedValue(
      validTasksData,
    );

    const response = await request(server).get(
      ROUTES.getNotepadPath(notepadId),
    );
    expect(response.status).toBe(validTasksData.status);
    expect(JSON.stringify(response.body)).toEqual(
      JSON.stringify(validTasksData),
    );
  });

  test(`should return 500 if an internal server error occurs - /notepads/${notepadId}`, async () => {
    vi.spyOn(taskRepository, 'getSingleNotepadTasks').mockRejectedValue(
      internalError,
    );

    const response = await request(server)
      .get(ROUTES.getNotepadPath(notepadId))
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: {} });
  });

  test(`should handle GET /notepads/${notepadId}/task/${taskId}`, async () => {
    vi.spyOn(taskRepository, 'getSingleTask').mockResolvedValue(validTaskData);

    const response = await request(server).get(
      ROUTES.getTaskDetailPath(notepadId, taskId),
    );
    expect(JSON.stringify(response.body)).toEqual(
      JSON.stringify(validTaskData),
    );
  });

  test(`should return 404 if task not found - /notepads/${notepadId}/tasks/${taskId}`, async () => {
    const updateResponse: TaskResponse = {
      status: 404,
      message: 'Task not found',
    };

    vi.spyOn(taskRepository, 'getSingleTask').mockResolvedValue(updateResponse);

    const response = await request(server)
      .get(`${ROUTES.getTaskDetailPath(notepadId, taskId)}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(updateResponse.status);
    expect(response.body).toEqual(updateResponse);
    expect(taskRepository.getSingleTask).toHaveBeenCalledWith(
      notepadId,
      taskId,
    );
  });

  test(`should return 500 if an internal server error occurs - /notepads/${notepadId}/task/${taskId}`, async () => {
    vi.spyOn(taskRepository, 'getSingleTask').mockRejectedValue(internalError);

    const response = await request(server)
      .get(`${ROUTES.getTaskDetailPath(notepadId, taskId)}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: {} });
  });
});

describe('httpServer POST', () => {
  beforeEach(() => {
    server.listen(port);
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.close();
  });

  describe('should handle POST /notepads', () => {
    test('should handle POST /notepads and return 201 status', async () => {
      const notepadData = { title: 'New Notepad' };
      const notepadResponse: NotepadResponse = {
        status: 201,
        message: `A notebook with the title ${notepadData.title} has been successfully created`,
      };

      vi.spyOn(taskRepository, 'createNotepad').mockResolvedValue(
        notepadResponse,
      );

      const response = await request(server)
        .post(ROUTES.NOTEPADS)
        .send(notepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toEqual(notepadResponse);
      expect(taskRepository.createNotepad).toHaveBeenCalledWith(notepadData);
    });

    test('should return 400 if Content-Type is not application/json', async () => {
      const notepadData = { title: 'New Notepad' };

      const response = await request(server)
        .post(ROUTES.NOTEPADS)
        .send(JSON.stringify(notepadData))
        .set('Accept', 'application/json')
        .set('Content-Type', 'text/plain');

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid Content-Type');
    });

    test('should return 400 if notepad data is invalid', async () => {
      const invalidNotepadData = { title: null };
      const mockZodError = {
        message: 'Title is required',
        code: 'invalid_type',
        path: ['title'],
        expected: 'string',
        input: null,
      };

      const validationError = {
        message: validationErrorMessage,
        errors: mockZodError,
      };

      vi.spyOn(createNotepadSchema, 'safeParse').mockReturnValue({
        success: false,
        error: mockZodError as unknown as MockZodError,
      });

      const response = await request(server)
        .post(ROUTES.NOTEPADS)
        .send(invalidNotepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual(validationError);
    });

    test('should return 409 if notepad with the same title already exists', async () => {
      const notepadData = { title: 'Existing Notepad' };
      const notepadResponse: NotepadResponse = {
        status: 409,
        message: `A notebook with the title ${notepadData.title} already exists`,
      };

      vi.spyOn(taskRepository, 'createNotepad').mockResolvedValue(
        notepadResponse,
      );

      const response = await request(server)
        .post(ROUTES.NOTEPADS)
        .send(notepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(409);
      expect(response.body).toEqual(notepadResponse);
    });

    test('should return 500 if an internal server error occurs', async () => {
      const notepadData = { title: 'New Notepad' };

      vi.spyOn(taskRepository, 'createNotepad').mockRejectedValue(
        internalError,
      );

      const response = await request(server)
        .post(ROUTES.NOTEPADS)
        .send(notepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: {} });
    });
  });

  describe(`should handle POST /notepads/${notepadId}/tasks`, () => {
    const taskData = {
      title: '1',
      description: 'Созданная',
    };

    test(`should handle POST /notepads/${notepadId}/tasks and return 201 status`, async () => {
      const taskResponse: TaskResponse = {
        status: 201,
        message: `A task with the title ${taskData.title} has been successfully created`,
      };

      vi.spyOn(taskRepository, 'createTask').mockResolvedValue(taskResponse);

      const response = await request(server)
        .post(ROUTES.getNotepadPath(notepadId))
        .send(taskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(taskResponse.status);
      expect(response.body).toEqual(taskResponse);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        taskData,
        notepadId,
      );
    });

    test('should return 400 if Content-Type is not application/json', async () => {
      const response = await request(server)
        .post(ROUTES.getNotepadPath(notepadId))
        .send(JSON.stringify(taskData))
        .set('Accept', 'application/json')
        .set('Content-Type', 'text/plain');

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid Content-Type');
    });

    test('should return 400 if task data is invalid', async () => {
      const invalidTaskData = {
        title: null,
        description: 'Созданная',
      };

      const mockZodError = [
        {
          message: 'Title is required',
          code: 'invalid_type',
          path: ['title'],
          expected: 'string',
          received: 'null',
        },
      ];

      const validationError = {
        message: 'Invalid data',
        errors: mockZodError,
      };

      vi.spyOn(createTaskSchema, 'safeParse').mockReturnValue({
        success: false,
        error: mockZodError as unknown as MockZodError,
      });

      const response = await request(server)
        .post(ROUTES.getNotepadPath(notepadId))
        .send(invalidTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual(validationError);
    });

    test('should return 500 if an internal server error occurs', async () => {
      const taskData = { title: 'New Task' };

      vi.spyOn(taskRepository, 'createTask').mockRejectedValue(internalError);

      const response = await request(server)
        .post(ROUTES.getNotepadPath(notepadId))
        .send(taskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: {} });
    });
  });
});

describe('httpServer PATH', () => {
  beforeEach(() => {
    server.listen(port);
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.close();
  });

  describe(`should handle PATCH /notepads/${notepadId}`, () => {
    const updatedNotepadData = { title: 'New Notepad Title' };
    const notepadResponse: NotepadResponse = {
      status: 200,
      message: `A notepad with the id ${notepadId} has been successfully updated`,
    };

    test(`should handle PATCH /notepads/${notepadId} and return 200 status`, async () => {
      vi.spyOn(taskRepository, 'updateNotepad').mockResolvedValue(
        notepadResponse,
      );

      const response = await request(server)
        .patch(`${ROUTES.NOTEPADS}/${notepadId}`)
        .send(updatedNotepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(notepadResponse.status);
      expect(response.body).toEqual(notepadResponse);
      expect(taskRepository.updateNotepad).toHaveBeenCalledWith(
        notepadId,
        updatedNotepadData,
      );
    });

    test('should return 400 if Content-Type is not application/json', async () => {
      const response = await request(server)
        .patch(`${ROUTES.NOTEPADS}/${notepadId}`)
        .send(JSON.stringify(updatedNotepadData))
        .set('Accept', 'application/json')
        .set('Content-Type', 'text/plain');

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid Content-Type');
    });

    test('should return 400 if notepad data is invalid', async () => {
      const invalidNotepadData = { title: null };
      const mockZodError = {
        message: 'Title is required',
        code: 'invalid_type',
        path: ['title'],
        expected: 'string',
        input: 'null',
      };

      const validationError = {
        message: validationErrorMessage,
        errors: mockZodError,
      };

      vi.spyOn(createNotepadSchema, 'safeParse').mockReturnValue({
        success: false,
        error: mockZodError as unknown as MockZodError,
      });

      const response = await request(server)
        .patch(`${ROUTES.NOTEPADS}/${notepadId}`)
        .send(invalidNotepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual(validationError);
    });

    test('should return 404 if notepad not found', async () => {
      const updateResponse: NotepadResponse = {
        status: 404,
        message: 'Notepad not found',
      };

      vi.spyOn(taskRepository, 'updateNotepad').mockResolvedValue(
        updateResponse,
      );

      const response = await request(server)
        .patch(`${ROUTES.NOTEPADS}/${notepadId}`)
        .send(updatedNotepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(updateResponse.status);
      expect(response.body).toEqual(updateResponse);
      expect(taskRepository.updateNotepad).toHaveBeenCalledWith(
        notepadId,
        updatedNotepadData,
      );
    });

    test('should return 500 if an internal server error occurs', async () => {
      const notepadData = { title: 'New Notepad' };

      vi.spyOn(taskRepository, 'updateNotepad').mockRejectedValue(
        internalError,
      );

      const response = await request(server)
        .patch(`${ROUTES.NOTEPADS}/${notepadId}`)
        .send(notepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: {} });
    });
  });

  describe(`should handle PATCH /notepads/${notepadId}/tasks/${taskId}`, () => {
    const updatedTaskData = {
      title: '1',
      isCompleted: true,
    };

    const taskResponse: TaskResponse = {
      status: 200,
      message: `A task with the _id ${taskId} has been successfully updated`,
    };

    test(`should handle PATCH /notepads/${notepadId}/task/${taskId} and return 200 status`, async () => {
      vi.spyOn(taskRepository, 'updateTask').mockResolvedValue(taskResponse);

      const response = await request(server)
        .patch(`${ROUTES.getTaskDetailPath(notepadId, taskId)}`)
        .send(updatedTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(taskResponse.status);
      expect(response.body).toEqual(taskResponse);
      expect(taskRepository.updateTask).toHaveBeenCalledWith(
        taskId,
        updatedTaskData,
      );
    });

    test('should return 400 if Content-Type is not application/json', async () => {
      const response = await request(server)
        .patch(`${ROUTES.getTaskDetailPath(notepadId, taskId)}`)
        .send(JSON.stringify(updatedTaskData))
        .set('Accept', 'application/json')
        .set('Content-Type', 'text/plain');

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid Content-Type');
    });

    test('should return 400 if task data is invalid', async () => {
      const invalidTaskData = {
        title: 'title',
        description: 'Созданная',
        subtasks: [{ title: 'abc3111', isCompleted: 2, _id: '1' }],
      };

      const mockZodError = {
        issues: [
          {
            expected: 'boolean',
            code: 'invalid_type',
            path: ['subtasks', 0, 'isCompleted'],
            message: 'Invalid input: expected boolean, received number',
          },
        ],
        name: 'ZodError',
      };

      const validationError = {
        message: validationErrorMessage,
        errors: {
          message: JSON.stringify(mockZodError.issues, null, 2),
          name: 'ZodError',
        },
      };

      vi.spyOn(createTaskSchema, 'safeParse').mockReturnValue({
        success: false,
        error: mockZodError as unknown as MockZodError,
      });

      const response = await request(server)
        .patch(`${ROUTES.getTaskDetailPath(notepadId, taskId)}`)
        .send(invalidTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual(validationError);
    });

    test('should return 404 if task not found', async () => {
      const updateResponse: TaskResponse = {
        status: 404,
        message: 'Task not found',
      };

      vi.spyOn(taskRepository, 'updateTask').mockResolvedValue(updateResponse);

      const response = await request(server)
        .patch(`${ROUTES.getTaskDetailPath(notepadId, taskId)}`)
        .send(updatedTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(updateResponse.status);
      expect(response.body).toEqual(updateResponse);
      expect(taskRepository.updateTask).toHaveBeenCalledWith(
        taskId,
        updatedTaskData,
      );
    });

    test('should return 500 if an internal server error occurs', async () => {
      vi.spyOn(taskRepository, 'updateTask').mockRejectedValue(internalError);

      const response = await request(server)
        .patch(`${ROUTES.getTaskDetailPath(notepadId, taskId)}`)
        .send(updatedTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: {} });
    });
  });
});

describe('httpServer DELETE', () => {
  beforeEach(() => {
    server.listen(port);
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.close();
  });

  describe(`should handle DELETE /notepads/${notepadId}`, () => {
    test(`should handle DELETE /notepads/${notepadId} and return 200 status`, async () => {
      const deleteResponse: NotepadResponse = {
        status: 200,
        message: 'Notepad deleted successfully',
      };

      vi.spyOn(taskRepository, 'deleteNotepad').mockResolvedValue(
        deleteResponse,
      );

      const response = await request(server)
        .delete(`${ROUTES.NOTEPADS}/${notepadId}`)
        .send(notepadId)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(deleteResponse.status);
      expect(response.body).toEqual(deleteResponse);
      expect(taskRepository.deleteNotepad).toHaveBeenCalledWith(notepadId);
    });

    test('should return 404 if notepad not found', async () => {
      const deleteResponse: NotepadResponse = {
        status: 404,
        message: 'Notepad not found',
      };

      vi.spyOn(taskRepository, 'deleteNotepad').mockResolvedValue(
        deleteResponse,
      );

      const response = await request(server)
        .delete(`${ROUTES.NOTEPADS}/${notepadId}`)
        .send(notepadId)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(deleteResponse.status);
      expect(response.body).toEqual(deleteResponse);
      expect(taskRepository.deleteNotepad).toHaveBeenCalledWith(notepadId);
    });

    test('should return 500 if an internal server error occurs', async () => {
      vi.spyOn(taskRepository, 'deleteNotepad').mockRejectedValue(
        internalError,
      );

      const response = await request(server)
        .delete(`${ROUTES.NOTEPADS}/${notepadId}`)
        .send(notepadId)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: {} });
    });
  });

  describe(`should handle DELETE /notepads/${notepadId}/tasks/${taskId}`, () => {
    test(`should handle DELETE /notepads/${notepadId}/task/${taskId} and return 200 status`, async () => {
      const deleteResponse: TaskResponse = {
        status: 200,
        message: 'Task deleted successfully',
      };

      vi.spyOn(taskRepository, 'deleteTask').mockResolvedValue(deleteResponse);

      const response = await request(server)
        .delete(`${ROUTES.getTaskDetailPath(notepadId, taskId)}`)
        .send(taskId)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(deleteResponse.status);
      expect(response.body).toEqual(deleteResponse);
      expect(taskRepository.deleteTask).toHaveBeenCalledWith(taskId);
    });

    test('should return 404 if task not found', async () => {
      const deleteResponse: TaskResponse = {
        status: 404,
        message: 'Task not found',
      };

      vi.spyOn(taskRepository, 'deleteTask').mockResolvedValue(deleteResponse);

      const response = await request(server)
        .delete(`${ROUTES.getTaskDetailPath(notepadId, taskId)}`)
        .send(taskId)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(deleteResponse.status);
      expect(response.body).toEqual(deleteResponse);
      expect(taskRepository.deleteTask).toHaveBeenCalledWith(taskId);
    });

    test('should return 500 if an internal server error occurs', async () => {
      const error = new Error('Internal Server Error');

      vi.spyOn(taskRepository, 'deleteTask').mockRejectedValue(error);

      const response = await request(server)
        .delete(`${ROUTES.getTaskDetailPath(notepadId, taskId)}`)
        .send(taskId)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: {} });
    });
  });
});

describe('httpServer OPTIONS', () => {
  beforeEach(() => {
    server.listen(port);
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.close();
  });

  test(`should handle OPTIONS /notepads and return 204 status`, async () => {
    const response = await request(server)
      .options(ROUTES.NOTEPADS)
      .set('Accept', 'application/json');

    expect(response.status).toBe(204);
  });
});

describe('httpServer non-existent routes', () => {
  const nonExistentRouteResponse: NotepadResponse = {
    status: 404,
    message: 'Route not found',
  };

  beforeEach(() => {
    server.listen(port);
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.close();
  });

  test(`should handle PUT /notepads/${notepadId} and return 404 status`, async () => {
    const response = await request(server)
      .put(ROUTES.getNotepadPath(notepadId))
      .send(notepadId)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(nonExistentRouteResponse.status);
    expect(response.body).toEqual({
      message: nonExistentRouteResponse.message,
    });
  });

  test(`should handle PUT /notepads/${notepadId}/tasks/${taskId} and return 404 status`, async () => {
    const response = await request(server)
      .put(`${ROUTES.getTaskDetailPath(notepadId, taskId)}`)
      .send(notepadId)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(nonExistentRouteResponse.status);
    expect(response.body).toEqual({
      message: nonExistentRouteResponse.message,
    });
  });

  test(`should handle GET /router and return 404 status`, async () => {
    const response = await request(server)
      .get('/router')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(nonExistentRouteResponse.status);
    expect(response.body).toEqual({
      message: nonExistentRouteResponse.message,
    });
  });
});
