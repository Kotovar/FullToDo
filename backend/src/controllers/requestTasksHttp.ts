import { Task } from '@shared/types';
import { TaskRepository } from '../repositories/TaskRepository';
import { errorHandler, parseJsonBody, type HttpContext } from './utils';

export const getAllTasks = async (
  { res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const result = await repository.getAllTasks();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getSingleTask = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const url = req.url?.split('/') ?? '';
    const taskId = url[4];

    if (!taskId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Task ID is required' }));
    }

    const result = await repository.getSingleTask(taskId);

    if (result.status === 404) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Task not found' }));
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getTodayTasks = async (
  { res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const result = await repository.getTasksWithDueDate(new Date());
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getSingleNotepadTasks = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  const url = req.url?.split('/') ?? '';
  const id = url[2];

  try {
    const result = await repository.getTasksByNotepad(id);
    res.statusCode = result.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const createTask = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    if (req.headers['content-type'] !== 'application/json') {
      res.writeHead(400);
      return res.end('Invalid Content-Type');
    }

    const task = await parseJsonBody<Task>(req);
    const result = await repository.createTask(task);

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteTask = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const url = req.url?.split('/') ?? '';
    const taskId = url[4];

    if (!taskId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Task ID is required' }));
    }

    const result = await repository.deleteTask(taskId);

    if (result.status === 404) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Task not found' }));
    }

    res.writeHead(result.status);
    res.end();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateTask = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const url = req.url?.split('/') ?? '';
    const taskId = url[4];

    if (!taskId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Task ID is required' }));
    }

    const updatedTask = await parseJsonBody<Task>(req);

    if (!updatedTask.title) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Title is required' }));
    }

    const result = await repository.updateTask(taskId, updatedTask);

    if (result.status === 404) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Task not found' }));
    }

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};
