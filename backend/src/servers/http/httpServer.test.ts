import request from 'supertest';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ZodError } from 'zod';
import { ROUTES } from '@sharedCommon/routes';
import { taskRepository, userRepository } from '@repositories';
import { validTaskDataMock, validTasksData } from '@db/mock';
import { createHttpServer, extractPath } from './httpServer';
import { ConflictError, NotFoundError } from '@errors/AppError';
import { generateAccessToken } from '@utils';
import {
  type DbUser,
  type Notepad,
  type NotepadResponse,
  type Task,
  type TaskResponseSingle,
  createNotepadSchema,
  createTaskSchema,
  NOTEPAD_ID,
  TASK_ID,
  USER_ID,
} from '@sharedCommon/schemas';

const port = 3000;
const server = createHttpServer();
const internalError = new Error('Internal Server Error');
const validationErrorMessage = 'Invalid data';
const authHeader = `Bearer ${generateAccessToken(USER_ID)}`;

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

    const response = await request(server)
      .get(ROUTES.tasks.base)
      .set('Authorization', authHeader);

    expect(JSON.stringify(response.body.data)).toEqual(
      JSON.stringify(validTasksData.tasks),
    );
  });

  test('should return 500 if an internal server error occurs - /tasks', async () => {
    vi.spyOn(taskRepository, 'getAllTasks').mockRejectedValue(internalError);

    const response = await request(server)
      .get(ROUTES.tasks.base)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', authHeader);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });

  test('should return 401 if no auth token provided - /notepads', async () => {
    const response = await request(server)
      .get(ROUTES.notepads.base)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.body).toEqual({
      error: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    });
  });

  test('should handle GET /auth/me', async () => {
    const currentUser: DbUser = {
      userId: USER_ID,
      email: 'user@example.com',
      isVerified: true,
      passwordHash: 'hash',
    };

    vi.spyOn(userRepository, 'findById').mockResolvedValue(currentUser);

    const response = await request(server)
      .get(ROUTES.auth.me)
      .set('Authorization', authHeader);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: {
        userId: USER_ID,
        email: 'user@example.com',
        isVerified: true,
        hasPassword: true,
      },
    });
    expect(userRepository.findById).toHaveBeenCalledWith(USER_ID);
  });

  test(`should handle GET /notepads/${NOTEPAD_ID}`, async () => {
    vi.spyOn(taskRepository, 'getSingleNotepadTasks').mockResolvedValue(
      validTasksData,
    );

    const response = await request(server)
      .get(ROUTES.notepads.getPath(NOTEPAD_ID))
      .set('Authorization', authHeader);

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body.data)).toEqual(
      JSON.stringify(validTasksData.tasks),
    );
  });

  test(`should return 500 if an internal server error occurs - /notepads/${NOTEPAD_ID}`, async () => {
    vi.spyOn(taskRepository, 'getSingleNotepadTasks').mockRejectedValue(
      internalError,
    );

    const response = await request(server)
      .get(ROUTES.notepads.getPath(NOTEPAD_ID))
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', authHeader);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });

  test(`should handle GET /notepads/${NOTEPAD_ID}/task/${TASK_ID}`, async () => {
    vi.spyOn(taskRepository, 'getSingleTask').mockResolvedValue(
      validTaskDataMock,
    );

    const response = await request(server)
      .get(ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID))
      .set('Authorization', authHeader);

    expect(JSON.stringify(response.body.data)).toEqual(
      JSON.stringify(validTaskDataMock),
    );
  });

  test(`should return 404 if task not found - /notepads/${NOTEPAD_ID}/tasks/${TASK_ID}`, async () => {
    const notFoundError = new NotFoundError('Task not found');

    vi.spyOn(taskRepository, 'getSingleTask').mockRejectedValue(notFoundError);

    const response = await request(server)
      .get(`${ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID)}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', authHeader);

    expect(response.status).toBe(404);
    expect(taskRepository.getSingleTask).toHaveBeenCalledWith(
      NOTEPAD_ID,
      TASK_ID,
      USER_ID,
    );
  });

  test(`should return 500 if an internal server error occurs - /notepads/${NOTEPAD_ID}/task/${TASK_ID}`, async () => {
    vi.spyOn(taskRepository, 'getSingleTask').mockRejectedValue(internalError);

    const response = await request(server)
      .get(`${ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID)}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', authHeader);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
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
    const notepadData = { title: 'New Notepad' };

    test('should handle POST /notepads and return 201 status', async () => {
      const createdNotepad: Notepad = {
        _id: 'some-id',
        title: notepadData.title,
        userId: USER_ID,
        tasks: [],
      };

      vi.spyOn(taskRepository, 'createNotepad').mockResolvedValue(
        createdNotepad,
      );

      const response = await request(server)
        .post(ROUTES.notepads.base)
        .send(notepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: `Notepad "${notepadData.title}" created`,
          notepad: expect.objectContaining({ title: notepadData.title }),
        }),
      );
      expect(taskRepository.createNotepad).toHaveBeenCalledWith(
        notepadData,
        USER_ID,
      );
    });

    test('should return 400 if Content-Type is not application/json', async () => {
      const response = await request(server)
        .post(ROUTES.notepads.base)
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
        .post(ROUTES.notepads.base)
        .send(invalidNotepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(validationError);
    });

    test('should return 409 if notepad with the same title already exists', async () => {
      const conflictError = new ConflictError(
        `A notebook with the title ${notepadData.title} already exists`,
      );

      vi.spyOn(taskRepository, 'createNotepad').mockRejectedValue(
        conflictError,
      );

      const response = await request(server)
        .post(ROUTES.notepads.base)
        .send(notepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(409);
    });

    test('should return 500 if an internal server error occurs', async () => {
      vi.spyOn(taskRepository, 'createNotepad').mockRejectedValue(
        internalError,
      );

      const response = await request(server)
        .post(ROUTES.notepads.base)
        .send(notepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe(`should handle POST /notepads/${NOTEPAD_ID}/tasks`, () => {
    const taskData = {
      title: '1',
      description: 'Созданная',
    };

    test(`should handle POST /notepads/${NOTEPAD_ID}/tasks and return 201 status`, async () => {
      const createdTask: Task = {
        _id: 'some-id',
        title: taskData.title,
        createdDate: new Date(),
        notepadId: NOTEPAD_ID,
        progress: '',
        userId: USER_ID,
        isCompleted: false,
      };

      vi.spyOn(taskRepository, 'createTask').mockResolvedValue(createdTask);

      const response = await request(server)
        .post(ROUTES.notepads.getPath(NOTEPAD_ID))
        .send(taskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: `Task "${taskData.title}" created`,
          task: expect.objectContaining({
            ...createdTask,
            createdDate: createdTask.createdDate.toISOString(),
          }),
        }),
      );
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        taskData,
        NOTEPAD_ID,
        USER_ID,
      );
    });

    test('should return 400 if Content-Type is not application/json', async () => {
      const response = await request(server)
        .post(ROUTES.notepads.getPath(NOTEPAD_ID))
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
        .post(ROUTES.notepads.getPath(NOTEPAD_ID))
        .send(invalidTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(validationError);
    });

    test('should return 500 if an internal server error occurs', async () => {
      const taskData = { title: 'New Task' };

      vi.spyOn(taskRepository, 'createTask').mockRejectedValue(internalError);

      const response = await request(server)
        .post(ROUTES.notepads.getPath(NOTEPAD_ID))
        .send(taskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
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

  describe(`should handle PATCH /notepads/${NOTEPAD_ID}`, () => {
    const updatedNotepadData = { title: 'New Notepad Title' };
    const notepadResponse: NotepadResponse = {
      status: 200,
      message: `A notepad with the id ${NOTEPAD_ID} has been successfully updated`,
    };

    test(`should handle PATCH /notepads/${NOTEPAD_ID} and return 200 status`, async () => {
      const updatedNotepad: Notepad = {
        _id: 'some-id',
        title: '',
        userId: USER_ID,
        tasks: [],
      };

      vi.spyOn(taskRepository, 'updateNotepad').mockResolvedValue(
        updatedNotepad,
      );

      const response = await request(server)
        .patch(`${ROUTES.notepads.base}/${NOTEPAD_ID}`)
        .send(updatedNotepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(notepadResponse.status);
      expect(response.body.data).toEqual(updatedNotepad);
      expect(taskRepository.updateNotepad).toHaveBeenCalledWith(
        NOTEPAD_ID,
        updatedNotepadData,
        USER_ID,
      );
    });

    test('should return 400 if Content-Type is not application/json', async () => {
      const response = await request(server)
        .patch(`${ROUTES.notepads.base}/${NOTEPAD_ID}`)
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
        .patch(`${ROUTES.notepads.base}/${NOTEPAD_ID}`)
        .send(invalidNotepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(validationError);
    });

    test('should return 404 if notepad not found', async () => {
      const notFoundError = new NotFoundError('Notepad not found');

      vi.spyOn(taskRepository, 'updateNotepad').mockRejectedValue(
        notFoundError,
      );

      const response = await request(server)
        .patch(`${ROUTES.notepads.base}/${NOTEPAD_ID}`)
        .send(updatedNotepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(404);
      expect(taskRepository.updateNotepad).toHaveBeenCalledWith(
        NOTEPAD_ID,
        updatedNotepadData,
        USER_ID,
      );
    });

    test('should return 500 if an internal server error occurs', async () => {
      const notepadData = { title: 'New Notepad' };

      vi.spyOn(taskRepository, 'updateNotepad').mockRejectedValue(
        internalError,
      );

      const response = await request(server)
        .patch(`${ROUTES.notepads.base}/${NOTEPAD_ID}`)
        .send(notepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe(`should handle PATCH /notepads/${NOTEPAD_ID}/tasks/${TASK_ID}`, () => {
    const updatedTaskData = {
      title: '1',
      isCompleted: true,
    };

    const taskResponse: TaskResponseSingle = {
      status: 200,
      message: `A task with the _id ${TASK_ID} has been successfully updated`,
    };

    test(`should handle PATCH /notepads/${NOTEPAD_ID}/task/${TASK_ID} and return 200 status`, async () => {
      const updatedTask: Task = {
        _id: 'some-id',
        userId: USER_ID,
        title: '',
        createdDate: new Date(),
        notepadId: NOTEPAD_ID,
        progress: '',
        isCompleted: false,
      };

      vi.spyOn(taskRepository, 'updateTask').mockResolvedValue(updatedTask);

      const response = await request(server)
        .patch(`${ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID)}`)
        .send(updatedTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(taskResponse.status);
      expect(response.body.data).toEqual(
        expect.objectContaining({
          ...updatedTask,
          createdDate: updatedTask.createdDate.toISOString(),
        }),
      );
      expect(taskRepository.updateTask).toHaveBeenCalledWith(
        TASK_ID,
        updatedTaskData,
        USER_ID,
      );
    });

    test('should return 400 if Content-Type is not application/json', async () => {
      const response = await request(server)
        .patch(`${ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID)}`)
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
        .patch(`${ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID)}`)
        .send(invalidTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(validationError);
    });

    test('should return 404 if task not found', async () => {
      const notFoundError = new NotFoundError('Task not found');

      vi.spyOn(taskRepository, 'updateTask').mockRejectedValue(notFoundError);

      const response = await request(server)
        .patch(`${ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID)}`)
        .send(updatedTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(404);
      expect(taskRepository.updateTask).toHaveBeenCalledWith(
        TASK_ID,
        updatedTaskData,
        USER_ID,
      );
    });

    test('should return 500 if an internal server error occurs', async () => {
      vi.spyOn(taskRepository, 'updateTask').mockRejectedValue(internalError);

      const response = await request(server)
        .patch(`${ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID)}`)
        .send(updatedTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
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

  describe(`should handle DELETE /notepads/${NOTEPAD_ID}`, () => {
    test(`should handle DELETE /notepads/${NOTEPAD_ID} and return 200 status`, async () => {
      vi.spyOn(taskRepository, 'deleteNotepad').mockResolvedValue();

      const response = await request(server)
        .delete(`${ROUTES.notepads.base}/${NOTEPAD_ID}`)
        .send(NOTEPAD_ID)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(taskRepository.deleteNotepad).toHaveBeenCalledWith(
        NOTEPAD_ID,
        USER_ID,
      );
    });

    test('should return 404 if notepad not found', async () => {
      const notFoundError = new NotFoundError('Notepad not found');

      vi.spyOn(taskRepository, 'deleteNotepad').mockRejectedValue(
        notFoundError,
      );

      const response = await request(server)
        .delete(`${ROUTES.notepads.base}/${NOTEPAD_ID}`)
        .send(NOTEPAD_ID)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(404);
      expect(taskRepository.deleteNotepad).toHaveBeenCalledWith(
        NOTEPAD_ID,
        USER_ID,
      );
    });

    test('should return 500 if an internal server error occurs', async () => {
      vi.spyOn(taskRepository, 'deleteNotepad').mockRejectedValue(
        internalError,
      );

      const response = await request(server)
        .delete(`${ROUTES.notepads.base}/${NOTEPAD_ID}`)
        .send(NOTEPAD_ID)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe(`should handle DELETE /notepads/${NOTEPAD_ID}/tasks/${TASK_ID}`, () => {
    test(`should handle DELETE /notepads/${NOTEPAD_ID}/task/${TASK_ID} and return 200 status`, async () => {
      vi.spyOn(taskRepository, 'deleteTask').mockResolvedValue();

      const response = await request(server)
        .delete(`${ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID)}`)
        .send(TASK_ID)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(taskRepository.deleteTask).toHaveBeenCalledWith(TASK_ID, USER_ID);
    });

    test('should return 404 if task not found', async () => {
      const notFoundError = new NotFoundError('Task not found');
      vi.spyOn(taskRepository, 'deleteTask').mockRejectedValue(notFoundError);

      const response = await request(server)
        .delete(`${ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID)}`)
        .send(TASK_ID)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(404);
      expect(taskRepository.deleteTask).toHaveBeenCalledWith(TASK_ID, USER_ID);
    });

    test('should return 500 if an internal server error occurs', async () => {
      const error = new Error('Internal Server Error');

      vi.spyOn(taskRepository, 'deleteTask').mockRejectedValue(error);

      const response = await request(server)
        .delete(`${ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID)}`)
        .send(TASK_ID)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
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
      .options(ROUTES.notepads.base)
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

  test(`should handle PUT /notepads/${NOTEPAD_ID} and return 404 status`, async () => {
    const response = await request(server)
      .put(ROUTES.notepads.getPath(NOTEPAD_ID))
      .send(NOTEPAD_ID)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(nonExistentRouteResponse.status);
    expect(response.body).toEqual({
      message: nonExistentRouteResponse.message,
    });
  });

  test(`should handle PUT /notepads/${NOTEPAD_ID}/tasks/${TASK_ID} and return 404 status`, async () => {
    const response = await request(server)
      .put(`${ROUTES.notepads.getTaskPath(NOTEPAD_ID, TASK_ID)}`)
      .send(NOTEPAD_ID)
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
