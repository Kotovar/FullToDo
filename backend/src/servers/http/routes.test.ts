import { describe, test, expect, vi } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'http';
import { processRoute } from './routes';
import { taskRepository } from '../../repositories';
import * as controllers from '../../controllers';

describe('processRoute', () => {
  const res = {
    writeHead: vi.fn(),
    end: vi.fn(),
  } as unknown as ServerResponse;

  const commonReq = { url: '' } as IncomingMessage;
  const url = '/tasks/1';

  const getReq = (method: 'GET' | 'PATCH' | 'DELETE' | 'POST') => {
    return { ...commonReq, method } as IncomingMessage;
  };

  test('method GET', () => {
    const req = getReq('GET');

    vi.spyOn(controllers, 'getSingleTask').mockResolvedValue();

    processRoute(req, res, url);
    expect(controllers.getSingleTask).toHaveBeenCalledWith(
      { req, res },
      taskRepository,
    );
  });

  test('method PATCH', () => {
    const req = getReq('PATCH');

    vi.spyOn(controllers, 'updateTask').mockResolvedValue();

    processRoute(req, res, url);
    expect(controllers.updateTask).toHaveBeenCalledWith(
      { req, res },
      taskRepository,
    );
  });

  test('method DELETE', () => {
    const req = getReq('DELETE');

    vi.spyOn(controllers, 'deleteTask').mockResolvedValue();

    processRoute(req, res, url);
    expect(controllers.deleteTask).toHaveBeenCalledWith(
      { req, res },
      taskRepository,
    );
  });

  test('another method', () => {
    const req = getReq('POST');

    vi.spyOn(controllers, 'handleNotFound').mockResolvedValue();

    processRoute(req, res, url);
    expect(controllers.handleNotFound).toHaveBeenCalledWith(res);
  });

  test('method for /notepad/:notepadId url return handleNotFound', () => {
    const req = getReq('POST');
    const url = '/notepads/3';

    vi.spyOn(controllers, 'handleNotFound').mockResolvedValue();

    processRoute(req, res, url);
    expect(controllers.handleNotFound).toHaveBeenCalledWith(res);
  });

  test('return null if url is empty', () => {
    const req = getReq('POST');

    const result = processRoute(req, res, '');
    expect(result).toBeNull();
  });
});
