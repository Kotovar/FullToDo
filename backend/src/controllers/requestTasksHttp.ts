import { createTaskSchema, updateTaskSchema } from '@shared/schemas';
import { TaskRepository } from '../repositories/TaskRepository';
import { errorHandler, getId, parseJsonBody, type HttpContext } from './utils';

export const createTask = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    if (req.headers['content-type'] !== 'application/json') {
      res.writeHead(400);
      return res.end('Invalid Content-Type');
    }

    const notepadId = getId(req, 'notepad');
    const rawTask = await parseJsonBody<unknown>(req);
    const validationResult = createTaskSchema.safeParse(rawTask);

    if (!validationResult.success) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          message: 'Invalid Task data',
          errors: validationResult.error.errors,
        }),
      );
    }

    const task = validationResult.data;
    const result = await repository.createTask(task, notepadId);

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
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
    const notepadId = getId(req, 'notepad');
    const taskId = getId(req, 'task');
    const rawData = await repository.getSingleTask(taskId, notepadId);

    if (rawData.status === 404) {
      res.writeHead(rawData.status, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(rawData));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rawData));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getAllTasks = async (
  { res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const rawData = await repository.getAllTasks();

    res.writeHead(rawData.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rawData));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getTodayTasks = async (
  { res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const rawData = await repository.getTodayTasks();

    res.writeHead(rawData.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rawData));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getSingleNotepadTasks = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  const notepadId = getId(req, 'notepad');

  try {
    const rawData = await repository.getSingleNotepadTasks(notepadId);
    res.writeHead(rawData.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rawData));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateTask = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    if (req.headers['content-type'] !== 'application/json') {
      res.writeHead(400);
      return res.end('Invalid Content-Type');
    }

    const taskId = getId(req, 'task');
    const notepadId = getId(req, 'notepad');
    const rawTask = await parseJsonBody<unknown>(req);

    const validationResult = updateTaskSchema.safeParse(rawTask);

    if (!validationResult.success) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          message: 'Invalid task data',
          errors: validationResult.error.errors,
        }),
      );
    }

    const updatedTask = validationResult.data;
    const result = await repository.updateTask(taskId, notepadId, updatedTask);

    if (result.status === 404) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }

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
    const taskId = getId(req, 'task');
    const result = await repository.deleteTask(taskId);

    if (result.status === 404) {
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};
