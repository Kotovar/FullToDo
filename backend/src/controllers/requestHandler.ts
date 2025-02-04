import { IncomingMessage, ServerResponse } from 'http';
import { Request, Response } from 'express';
import { TaskRepository } from '../repositories/TaskRepository';

interface HttpContext {
  serverType: 'http' | 'express';
  req: IncomingMessage | Request;
  res: ServerResponse | Response;
}

export const handleRequest = async (
  { serverType, req, res }: HttpContext,
  repository: TaskRepository,
) => {
  if (
    serverType === 'http' &&
    req.method === 'GET' &&
    req.url === '/notepads/all'
  ) {
    res.statusCode = 200;

    return repository.getAllTasks();
  }
};
