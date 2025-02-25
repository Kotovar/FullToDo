import http from 'http';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ROUTES } from '@shared/routes';
import type {
  TaskResponse,
  NotepadWithoutTasksResponse,
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

const notepadBadResponse = {
  error: {},
};

const res = {
  writeHead: vi.fn(),
  end: vi.fn(),
} as unknown as http.ServerResponse;

describe('httpServer', () => {
  const port = 3000;
  const server = createHttpServer();

  beforeEach(() => {
    server.listen(port);
  });

  afterEach(() => {
    server.close();
  });

  test('should start and stop the server', async () => {
    expect(server.listening).toBe(true);

    server.close();
    expect(server.listening).toBe(false);
  });

  test('should handle POST /notepad', async () => {
    const req = {
      method: 'POST',
      url: ROUTES.NOTEPADS,
    } as http.IncomingMessage;

    await routes[`POST ${ROUTES.NOTEPADS}`]({ req, res });

    expect(res.end).toHaveBeenCalledWith(JSON.stringify(notepadBadResponse));
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
      url: ROUTES.getNotepadPath('16'),
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
