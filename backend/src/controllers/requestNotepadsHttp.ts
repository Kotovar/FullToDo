import type { IncomingMessage, ServerResponse } from 'http';
import { TaskRepository } from '../repositories/TaskRepository';
import { errorHandler, type HttpContext, parseJsonBody } from './utils';
import { Notepad } from '@shared/types';

export const getAllNotepads = async (
  { res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const result = await repository.getAllNotepads();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (error) {
    res.statusCode = 500;
    res.end('Error 500 ' + error);
  }
};

export const createNotepad = async (
  { req, res }: { req: IncomingMessage; res: ServerResponse },
  repository: TaskRepository,
) => {
  try {
    if (req.headers['content-type'] !== 'application/json') {
      res.writeHead(400);
      return res.end('Invalid Content-Type');
    }

    const { name } = await parseJsonBody<Notepad>(req);
    const result = await repository.createNotepad(name);

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};
