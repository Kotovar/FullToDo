import { createTaskSchema, updateTaskSchema } from '@shared/schemas';
import { TaskRepository } from '../repositories/TaskRepository';
import { errorHandler, getId, parseJsonBody, type HttpContext } from './utils';

export const createTask = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const notepadId = getId(req, 'notepad');

    if (!notepadId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Notepad ID is required' }));
    }

    const rawTask = await parseJsonBody<unknown>(req);
    const validationResult = createTaskSchema.safeParse(rawTask);

    if (!validationResult.success) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          message: 'Invalid task data',
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

    if (!taskId || !notepadId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({ message: 'Task and Notepad IDs are required' }),
      );
    }

    const result = await repository.getSingleTask(taskId, notepadId);

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
  const notepadId = getId(req, 'notepad');

  try {
    const result = await repository.getTasksByNotepad(notepadId);
    res.statusCode = result.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateTask = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const taskId = getId(req, 'task');
    const notepadId = getId(req, 'notepad');

    if (!taskId || !notepadId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({ message: 'Task and Notepad IDs are required' }),
      );
    }

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
      return res.end(JSON.stringify({ message: 'Task not found' }));
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
