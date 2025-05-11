import http from 'http';
import request from 'supertest';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ZodError, type ZodIssue } from 'zod';
import { ROUTES } from '@shared/routes';
import {
  type TasksResponse,
  type NotepadWithoutTasksResponse,
  type NotepadResponse,
  type TaskResponse,
  createNotepadSchema,
  createTaskSchema,
  commonNotepadId,
} from '@shared/schemas';
import { createHttpServer } from './httpServer';
import { taskRepository } from '../../repositories';
import { getSingleNotepadTasks, getSingleTask } from '../../controllers';
import { TASKS1 } from '../../db/mock/mock-db';
import { BASE_ROUTES } from './routes';

const validTasksData: TasksResponse = {
  status: 200,
  message: 'Success',
  data: TASKS1,
};

const validTaskData: TaskResponse = {
  status: 200,
  message: 'Success',
  data: {
    _id: '1',
    notepadId: '1',
    title: 'Задача 1',
    description: 'Описание для задачи 1',
    dueDate: new Date(),
    createdDate: new Date(),
    isCompleted: false,
    progress: '1 из 5',
    subtasks: [
      { isCompleted: false, title: 'Выучить Node.js', _id: '1' },
      { isCompleted: true, title: 'Выучить js', _id: '2' },
      { isCompleted: false, title: 'Выучить GO', _id: '3' },
      { isCompleted: false, title: 'Выучить Nest.js', _id: '4' },
      { isCompleted: false, title: 'Выучить Express', _id: '5' },
    ],
  },
};

const validNotepadWithoutTasksData: NotepadWithoutTasksResponse = {
  status: 200,
  message: 'Success',
  data: [
    {
      title: 'Задачи',
      _id: commonNotepadId,
    },
  ],
};

const port = 3000;
const server = createHttpServer();
const internalError = new Error('Internal Server Error');

const res = {
  writeHead: vi.fn(),
  end: vi.fn(),
} as unknown as http.ServerResponse;

describe('httpServer start/close', () => {
  test('should start and stop the server', async () => {
    server.listen(port);
    expect(server.listening).toBe(true);

    server.close();
    expect(server.listening).toBe(false);
  });
});

describe('httpServer GET', () => {
  const notepadId = '1';
  const taskId = '1';

  beforeEach(() => {
    server.listen(port);
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.close();
  });

  test('should handle GET /tasks', async () => {
    const req = {
      method: 'GET',
      url: ROUTES.TASKS,
    } as http.IncomingMessage;

    vi.spyOn(taskRepository, 'getAllTasks').mockResolvedValue(validTasksData);

    await BASE_ROUTES[`GET ${ROUTES.TASKS}`]({ req, res }, taskRepository);

    expect(res.writeHead).toHaveBeenCalledWith(validTasksData.status, {
      'Content-Type': 'application/json',
    });

    expect(res.end).toHaveBeenCalledWith(JSON.stringify(validTasksData));
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
    const req = {
      method: 'GET',
      url: ROUTES.NOTEPADS,
    } as http.IncomingMessage;

    vi.spyOn(taskRepository, 'getAllNotepads').mockResolvedValue(
      validNotepadWithoutTasksData,
    );

    await BASE_ROUTES[`GET ${ROUTES.NOTEPADS}`]({ req, res }, taskRepository);

    expect(res.writeHead).toHaveBeenCalledWith(
      validNotepadWithoutTasksData.status,
      {
        'Content-Type': 'application/json',
      },
    );

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify(validNotepadWithoutTasksData),
    );
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

  test('should handle GET /notepads/1', async () => {
    const req = {
      method: 'GET',
      url: ROUTES.getNotepadPath('1'),
    } as http.IncomingMessage;

    vi.spyOn(taskRepository, 'getSingleNotepadTasks').mockResolvedValue(
      validTasksData,
    );

    await getSingleNotepadTasks({ req, res }, taskRepository);

    expect(res.writeHead).toHaveBeenCalledWith(validTasksData.status, {
      'Content-Type': 'application/json',
    });

    expect(res.end).toHaveBeenCalledWith(JSON.stringify(validTasksData));
  });

  test('should return 500 if an internal server error occurs - /notepads/1', async () => {
    vi.spyOn(taskRepository, 'getSingleNotepadTasks').mockRejectedValue(
      internalError,
    );

    const response = await request(server)
      .get(ROUTES.getNotepadPath('1'))
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: {} });
  });

  test('should handle GET /notepads/1/task/1', async () => {
    const req = {
      method: 'GET',
      url: ROUTES.getTaskDetailPath('/notepads/1', '1'),
    } as http.IncomingMessage;

    vi.spyOn(taskRepository, 'getSingleTask').mockResolvedValue(validTaskData);

    await getSingleTask({ req, res }, taskRepository);

    expect(res.writeHead).toHaveBeenCalledWith(validTaskData.status, {
      'Content-Type': 'application/json',
    });

    expect(res.end).toHaveBeenCalledWith(JSON.stringify(validTaskData));
  });

  test('should return 404 if task not found - /notepads/1/tasks/1', async () => {
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

  test('should return 500 if an internal server error occurs - /notepads/1/task/1', async () => {
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
      const errors: ZodIssue[] = [
        {
          message: 'Title is required',
          code: 'invalid_type',
          path: ['title'],
          expected: 'string',
          received: 'null',
        },
      ];

      const validationError = {
        message: 'Invalid Notepad data',
        errors: errors,
      };

      const zodError = new ZodError(errors);

      vi.spyOn(createNotepadSchema, 'safeParse').mockReturnValue({
        success: false,
        error: zodError,
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

  describe('should handle POST /notepads/1/tasks', () => {
    const notepadId = '1';
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

      const errors: ZodIssue[] = [
        {
          message: 'Title is required',
          code: 'invalid_type',
          path: ['title'],
          expected: 'string',
          received: 'null',
        },
      ];

      const validationError = {
        message: 'Invalid Task data',
        errors: errors,
      };

      const zodError = new ZodError(errors);

      vi.spyOn(createTaskSchema, 'safeParse').mockReturnValue({
        success: false,
        error: zodError,
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
  const notepadId = '1';
  const taskId = '1';

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
      const errors: ZodIssue[] = [
        {
          message: 'Title is required',
          code: 'invalid_type',
          path: ['title'],
          expected: 'string',
          received: 'null',
        },
      ];

      const validationError = {
        message: 'Invalid Notepad data',
        errors: errors,
      };

      const zodError = new ZodError(errors);

      vi.spyOn(createNotepadSchema, 'safeParse').mockReturnValue({
        success: false,
        error: zodError,
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
        notepadId,
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

      const errors: ZodIssue[] = [
        {
          message: 'Expected boolean, received number',
          code: 'invalid_type',
          path: ['subtasks', 0, 'isCompleted'],
          expected: 'boolean',
          received: 'number',
        },
      ];

      const validationError = {
        message: 'Invalid task data',
        errors: errors,
      };

      const zodError = new ZodError(errors);

      vi.spyOn(createTaskSchema, 'safeParse').mockReturnValue({
        success: false,
        error: zodError,
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
        notepadId,
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
  const notepadId = '1';
  const taskId = '1';

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
  const notepadId = '1';
  const taskId = '1';
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
