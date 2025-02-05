import type { IncomingMessage, ServerResponse } from 'http';
import { TaskRepository } from '../repositories/TaskRepository';

interface HttpContext {
  serverType: 'http' | 'express';
  req: IncomingMessage;
  res: ServerResponse;
}

export const getAllTasks = async (
  { serverType, res }: HttpContext,
  repository: TaskRepository,
) => {
  if (serverType === 'http') {
    try {
      const result = await repository.getAllTasks();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    } catch (error) {
      res.statusCode = 500;
      res.end('Error 500 ' + error);
    }
  }
};

export const getTodayTasks = async (
  { serverType, res }: HttpContext,
  repository: TaskRepository,
) => {
  if (serverType === 'http') {
    try {
      const result = await repository.getTasksWithDueDate(new Date());
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    } catch (error) {
      res.statusCode = 500;
      res.end('Error 500 ' + error);
    }
  }
};

export const getSingleNotepadTasks = async (
  { serverType, req, res }: HttpContext,
  repository: TaskRepository,
) => {
  const url = req.url?.split('/') ?? '';
  if (serverType === 'http' && url.length === 3) {
    const id = url[2];

    try {
      const result = await repository.getTasksByNotepad(id);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    } catch (error) {
      res.statusCode = 500;
      res.end('Error 500 ' + error);
    }
  }
};

export const handleNotFound = async (res: ServerResponse) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Route not found');
};
