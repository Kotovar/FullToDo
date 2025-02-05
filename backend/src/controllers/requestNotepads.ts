import type { IncomingMessage, ServerResponse } from 'http';
import { TaskRepository } from '../repositories/TaskRepository';

interface HttpContext {
  serverType: 'http' | 'express';
  req: IncomingMessage;
  res: ServerResponse;
}

export const getAllNotepads = async (
  { serverType, res }: HttpContext,
  repository: TaskRepository,
) => {
  if (serverType === 'http') {
    try {
      const result = await repository.getAllNotepads();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    } catch (error) {
      res.statusCode = 500;
      res.end('Error 500 ' + error);
    }
  }
};
