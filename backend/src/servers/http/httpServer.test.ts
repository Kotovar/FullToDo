import http from 'http';
import request from 'supertest';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ZodError, type ZodIssue } from 'zod';
import { ROUTES } from '@shared/routes';
import {
  type TaskResponse,
  type NotepadWithoutTasksResponse,
  type NotepadResponse,
  createNotepadSchema,
  createTaskSchema,
} from '@shared/schemas';
import { createHttpServer, routes } from './httpServer';
import { taskRepository } from '../../repositories';
import { getSingleNotepadTasks, getSingleTask } from '../../controllers';
import { TASKS1 } from '../../db/mock/mock-db';

const validTaskData: TaskResponse = {
  status: 200,
  message: 'Success',
  data: TASKS1,
};

const validNotepadWithoutTasksData: NotepadWithoutTasksResponse = {
  status: 200,
  message: 'Success',
  data: [
    {
      title: 'Сегодня',
      _id: 'today',
    },
    {
      title: 'Задачи',
      _id: 'all',
    },
  ],
};

const port = 3000;
const server = createHttpServer();

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
  beforeEach(() => {
    server.listen(port);
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.close();
  });

  test('should handle GET /notepad/all', async () => {
    const req = {
      method: 'GET',
      url: ROUTES.ALL_TASKS,
    } as http.IncomingMessage;

    vi.spyOn(taskRepository, 'getAllTasks').mockResolvedValue(validTaskData);

    await routes[`GET ${ROUTES.ALL_TASKS}`]({ req, res });

    expect(res.writeHead).toHaveBeenCalledWith(validTaskData.status, {
      'Content-Type': 'application/json',
    });

    expect(res.end).toHaveBeenCalledWith(JSON.stringify(validTaskData));
  });

  test('should handle GET /notepad', async () => {
    const req = {
      method: 'GET',
      url: ROUTES.NOTEPADS,
    } as http.IncomingMessage;

    vi.spyOn(taskRepository, 'getAllNotepads').mockResolvedValue(
      validNotepadWithoutTasksData,
    );

    await routes[`GET ${ROUTES.NOTEPADS}`]({ req, res });

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

  test('should handle GET /notepad/today', async () => {
    const req = {
      method: 'GET',
      url: ROUTES.TODAY_TASKS,
    } as http.IncomingMessage;

    vi.spyOn(taskRepository, 'getTodayTasks').mockResolvedValue(validTaskData);

    await routes[`GET ${ROUTES.TODAY_TASKS}`]({ req, res });

    expect(res.writeHead).toHaveBeenCalledWith(validTaskData.status, {
      'Content-Type': 'application/json',
    });

    expect(res.end).toHaveBeenCalledWith(JSON.stringify(validTaskData));
  });

  test('should handle GET /notepad/1', async () => {
    const req = {
      method: 'GET',
      url: ROUTES.getNotepadPath('1'),
    } as http.IncomingMessage;

    vi.spyOn(taskRepository, 'getSingleNotepadTasks').mockResolvedValue(
      validTaskData,
    );

    await getSingleNotepadTasks({ req, res }, taskRepository);

    expect(res.writeHead).toHaveBeenCalledWith(validTaskData.status, {
      'Content-Type': 'application/json',
    });

    expect(res.end).toHaveBeenCalledWith(JSON.stringify(validTaskData));
  });

  test('should handle GET /notepad/1/task/1', async () => {
    const req = {
      method: 'GET',
      url: ROUTES.getTaskDetailPath('/notepad/1', '1'),
    } as http.IncomingMessage;

    vi.spyOn(taskRepository, 'getSingleTask').mockResolvedValue(validTaskData);

    await getSingleTask({ req, res }, taskRepository);

    expect(res.writeHead).toHaveBeenCalledWith(validTaskData.status, {
      'Content-Type': 'application/json',
    });

    expect(res.end).toHaveBeenCalledWith(JSON.stringify(validTaskData));
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

  describe('should handle POST /notepad', () => {
    test('should handle POST /notepad and return 201 status', async () => {
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
      const error = new Error('Internal Server Error');

      vi.spyOn(taskRepository, 'createNotepad').mockRejectedValue(error);

      const response = await request(server)
        .post(ROUTES.NOTEPADS)
        .send(notepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: {} });
    });
  });

  describe('should handle POST /notepad/1/task', () => {
    const notepadId = '1';
    const taskData = {
      title: '1',
      isCompleted: false,
      description: 'Созданная',
    };

    test(`should handle POST /notepad/${notepadId}/task and return 201 status`, async () => {
      const taskResponse: TaskResponse = {
        status: 201,
        message: `A task with the title ${taskData.title} has been successfully created`,
      };

      vi.spyOn(taskRepository, 'createTask').mockResolvedValue(taskResponse);

      const response = await request(server)
        .post(`${ROUTES.getNotepadPath(notepadId)}/task`)
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
        .post(`${ROUTES.getNotepadPath(notepadId)}/task`)
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
        .post(`${ROUTES.getNotepadPath(notepadId)}/task`)
        .send(invalidTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual(validationError);
    });

    test('should return 500 if an internal server error occurs', async () => {
      const taskData = { title: 'New Task' };
      const error = new Error('Internal Server Error');

      vi.spyOn(taskRepository, 'createTask').mockRejectedValue(error);

      const response = await request(server)
        .post(`${ROUTES.getNotepadPath(notepadId)}/task`)
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

  describe(`should handle PATCH /notepad/${notepadId}`, () => {
    const updatedNotepadData = { title: 'New Notepad Title' };
    const notepadResponse: NotepadResponse = {
      status: 200,
      message: `A notepad with the id ${notepadId} has been successfully updated`,
    };

    test(`should handle PATCH /notepad/${notepadId} and return 200 status`, async () => {
      vi.spyOn(taskRepository, 'updateNotepad').mockResolvedValue(
        notepadResponse,
      );

      const response = await request(server)
        .patch(ROUTES.getNotepadPath(notepadId))
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
        .patch(ROUTES.getNotepadPath(notepadId))
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
        .patch(ROUTES.getNotepadPath(notepadId))
        .send(invalidNotepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual(validationError);
    });

    test('should return 500 if an internal server error occurs', async () => {
      const notepadData = { title: 'New Notepad' };
      const error = new Error('Internal Server Error');

      vi.spyOn(taskRepository, 'updateNotepad').mockRejectedValue(error);

      const response = await request(server)
        .patch(ROUTES.getNotepadPath(notepadId))
        .send(notepadData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: {} });
    });
  });

  describe(`should handle PATCH /notepad/${notepadId}/task/${taskId}`, () => {
    const updatedTaskData = {
      title: '1',
      isCompleted: true,
      subtasks: [{ title: 'abc3111', isCompleted: false }],
    };

    const taskResponse: TaskResponse = {
      status: 200,
      message: `A task with the _id ${taskId} has been successfully updated`,
    };

    test(`should handle PATCH /notepad/${notepadId}/task/${taskId} and return 200 status`, async () => {
      vi.spyOn(taskRepository, 'updateTask').mockResolvedValue(taskResponse);

      const response = await request(server)
        .patch(`${ROUTES.getTaskDetailPath(`/notepad/${notepadId}`, taskId)}`)
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
        .patch(`${ROUTES.getTaskDetailPath(`/notepad/${notepadId}`, taskId)}`)
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
        subtasks: [{ title: 'abc3111', isCompleted: 2 }],
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
        .patch(`${ROUTES.getTaskDetailPath(`/notepad/${notepadId}`, taskId)}`)
        .send(invalidTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual(validationError);
    });

    test('should return 500 if an internal server error occurs', async () => {
      const error = new Error('Internal Server Error');

      vi.spyOn(taskRepository, 'updateTask').mockRejectedValue(error);

      const response = await request(server)
        .patch(`${ROUTES.getTaskDetailPath(`/notepad/${notepadId}`, taskId)}`)
        .send(updatedTaskData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: {} });
    });
  });
});
