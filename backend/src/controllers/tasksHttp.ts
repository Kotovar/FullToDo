import { updateTaskSchema, createTaskSchema } from '@sharedCommon/schemas';
import {
  checkContentType,
  errorHandler,
  getId,
  getValidatedTaskParams,
  handleValidationError,
  parseJsonBody,
} from './utils';
import { httpAuthMiddleware } from '@middleware';
import type { TaskService } from '@services/TaskService';
import type { ServiceHandler } from './types';

export const createTask: ServiceHandler<TaskService> = async (ctx, service) => {
  const { req, res } = ctx;
  try {
    if (!checkContentType(req, res)) return;

    const { userId } = httpAuthMiddleware(ctx);
    const { notepadId } = getId(req, 'notepad');
    const rawTask = await parseJsonBody(req);
    const validationResult = createTaskSchema.safeParse(rawTask);

    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const task = await service.createTask(
      validationResult.data,
      notepadId,
      userId,
    );

    res
      .writeHead(201, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: `Task "${task.title}" created`, task }));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getSingleTask: ServiceHandler<TaskService> = async (
  ctx,
  service,
) => {
  const { req, res } = ctx;
  try {
    const { userId } = httpAuthMiddleware(ctx);
    const { notepadId, taskId } = getId(req, 'task');
    const task = await service.getSingleTask(notepadId, taskId, userId);

    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Success', data: task }));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getAllTasks: ServiceHandler<TaskService> = async (
  ctx,
  service,
) => {
  const { res } = ctx;
  const params = getValidatedTaskParams(ctx.req);
  try {
    const { userId } = httpAuthMiddleware(ctx);
    const { tasks, meta } = await service.getAllTasks(userId, params);

    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Success', data: tasks, meta }));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getSingleNotepadTasks: ServiceHandler<TaskService> = async (
  ctx,
  service,
) => {
  const { req, res } = ctx;
  const params = getValidatedTaskParams(req);
  try {
    const { userId } = httpAuthMiddleware(ctx);
    const { notepadId } = getId(req, 'notepad');
    const { tasks, meta } = await service.getSingleNotepadTasks(
      notepadId,
      userId,
      params,
    );

    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Success', data: tasks, meta }));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateTask: ServiceHandler<TaskService> = async (ctx, service) => {
  const { req, res } = ctx;
  try {
    if (!checkContentType(req, res)) return;

    const { userId } = httpAuthMiddleware(ctx);
    const { taskId } = getId(req, 'task');
    const rawTask = await parseJsonBody(req);
    const validationResult = updateTaskSchema.safeParse(rawTask);

    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const updatedTask = await service.updateTask(
      taskId,
      validationResult.data,
      userId,
    );

    res.writeHead(200, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        message: `A task with the _id ${taskId} has been successfully updated`,
        data: updatedTask,
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteTask: ServiceHandler<TaskService> = async (ctx, service) => {
  const { req, res } = ctx;
  try {
    const { userId } = httpAuthMiddleware(ctx);
    const { taskId } = getId(req, 'task');
    await service.deleteTask(taskId, userId);

    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Task deleted successfully' }));
  } catch (error) {
    errorHandler(res, error);
  }
};
