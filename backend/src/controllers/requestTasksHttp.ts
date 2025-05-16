import { createTaskSchema, updateTaskSchema } from '@shared/schemas';
import {
  checkContentType,
  errorHandler,
  getId,
  getValidatedTaskParams,
  handleValidationError,
  parseJsonBody,
} from './utils';
import type { RequestHandler } from './types';

export const createTask: RequestHandler = async ({ req, res }, repository) => {
  try {
    if (!checkContentType(req, res)) return;

    const notepadId = getId(req, 'notepad');
    const rawTask = await parseJsonBody<unknown>(req);
    const validationResult = createTaskSchema.safeParse(rawTask);

    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const result = await repository.createTask(
      validationResult.data,
      notepadId,
    );
    res
      .writeHead(result.status, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getSingleTask: RequestHandler = async (
  { req, res },
  repository,
) => {
  try {
    const taskId = getId(req, 'task');
    const result = await repository.getSingleTask(taskId);

    res
      .writeHead(result.status, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getAllTasks: RequestHandler = async ({ req, res }, repository) => {
  const params = getValidatedTaskParams(req);

  try {
    const result = await repository.getAllTasks(params);
    res
      .writeHead(result.status, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getSingleNotepadTasks: RequestHandler = async (
  { req, res },
  repository,
) => {
  const params = getValidatedTaskParams(req);

  try {
    const notepadId = getId(req, 'notepad');
    const result = await repository.getSingleNotepadTasks(notepadId, params);

    res
      .writeHead(result.status, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateTask: RequestHandler = async ({ req, res }, repository) => {
  try {
    if (!checkContentType(req, res)) return;

    const taskId = getId(req, 'task');
    const rawTask = await parseJsonBody<unknown>(req);
    const validationResult = updateTaskSchema.safeParse(rawTask);

    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const result = await repository.updateTask(taskId, validationResult.data);
    res
      .writeHead(result.status, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteTask: RequestHandler = async ({ req, res }, repository) => {
  try {
    const taskId = getId(req, 'task');
    const result = await repository.deleteTask(taskId);

    res
      .writeHead(result.status, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};
