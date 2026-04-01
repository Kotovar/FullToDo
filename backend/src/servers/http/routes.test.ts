import { describe, test, expect, vi } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'http';
import * as controllers from '@controllers';
import { handleRoute } from './routes';
import { TaskService } from '@services/TaskService';

describe('routes', () => {
  const res = {
    writeHead: vi.fn(),
    end: vi.fn(),
  } as unknown as ServerResponse;

  const commonReq = { url: '' } as IncomingMessage;

  const getReq = (method: 'GET' | 'PATCH' | 'DELETE' | 'POST') => {
    return { ...commonReq, method } as IncomingMessage;
  };

  test('method GET', () => {
    const req = getReq('GET');
    vi.spyOn(controllers, 'getSingleTask').mockResolvedValue();

    handleRoute({ req, res }, '/tasks/1');

    expect(controllers.getSingleTask).toHaveBeenCalledWith(
      { req, res },
      expect.any(TaskService),
    );
  });

  test('method PATCH', () => {
    const req = getReq('PATCH');
    vi.spyOn(controllers, 'updateTask').mockResolvedValue();

    handleRoute({ req, res }, '/tasks/1');

    expect(controllers.updateTask).toHaveBeenCalledWith(
      { req, res },
      expect.any(TaskService),
    );
  });

  test('method DELETE', () => {
    const req = getReq('DELETE');
    vi.spyOn(controllers, 'deleteTask').mockResolvedValue();

    handleRoute({ req, res }, '/tasks/1');

    expect(controllers.deleteTask).toHaveBeenCalledWith(
      { req, res },
      expect.any(TaskService),
    );
  });

  test('another method', () => {
    const req = getReq('POST');
    vi.spyOn(controllers, 'handleNotFound').mockImplementation(async () => {});

    handleRoute({ req, res }, '/tasks/1');

    expect(controllers.handleNotFound).toHaveBeenCalledWith(res);
  });

  test('method for /notepad/:notepadId url return handleNotFound', () => {
    const req = getReq('GET');
    vi.spyOn(controllers, 'handleNotFound').mockImplementation(async () => {});

    handleRoute({ req, res }, '/notepads/1');

    expect(controllers.handleNotFound).toHaveBeenCalledWith(res);
  });
});
