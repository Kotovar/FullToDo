import { Router, type Request, type Response } from 'express';
import {
  COMMON_NOTEPAD_ID,
  createTaskSchema,
  updateTaskSchema,
} from '@sharedCommon/schemas';
import { ROUTES } from '@sharedCommon/routes';
import { expressAuthMiddleware, expressCheckContentType } from '@middleware';
import { expressHandleValidationError } from '@controllers';
import { getValidatedTaskParams, param } from './helpers';
import { taskService } from './services';

export const taskRouter = Router();

const createTask = async (req: Request, res: Response, notepadId: string) => {
  const validation = createTaskSchema.safeParse(req.body);
  if (!validation.success) {
    expressHandleValidationError(res, validation.error);
    return;
  }

  const task = await taskService.createTask(
    validation.data,
    notepadId,
    req.userId,
  );

  res.status(201).json({ message: `Task "${task.title}" created`, task });
};

const getTask = async (req: Request, res: Response, notepadId: string) => {
  const task = await taskService.getSingleTask(
    notepadId,
    param(req, 'taskId'),
    req.userId,
  );

  res.status(200).json({ message: 'Success', data: task });
};

const updateTask = async (req: Request, res: Response) => {
  const validation = updateTaskSchema.safeParse(req.body);
  if (!validation.success) {
    expressHandleValidationError(res, validation.error);
    return;
  }

  const taskId = param(req, 'taskId');
  const updatedTask = await taskService.updateTask(
    taskId,
    validation.data,
    req.userId,
  );

  res.status(200).json({
    message: `A task with the _id ${taskId} has been successfully updated`,
    data: updatedTask,
  });
};

const deleteTask = async (req: Request, res: Response) => {
  await taskService.deleteTask(param(req, 'taskId'), req.userId);
  res.status(200).json({ message: 'Task deleted successfully' });
};

taskRouter.post(
  ROUTES.tasks.base,
  expressAuthMiddleware,
  expressCheckContentType,
  async (req, res) => createTask(req, res, COMMON_NOTEPAD_ID),
);

taskRouter.get(ROUTES.tasks.base, expressAuthMiddleware, async (req, res) => {
  const { tasks, meta } = await taskService.getAllTasks(
    req.userId,
    getValidatedTaskParams(req),
  );

  res.status(200).json({ message: 'Success', data: tasks, meta });
});

taskRouter.post(
  ROUTES.notepads.tasks,
  expressAuthMiddleware,
  expressCheckContentType,
  async (req, res) => createTask(req, res, param(req, 'notepadId')),
);

taskRouter.get(
  ROUTES.notepads.tasks,
  expressAuthMiddleware,
  async (req, res) => {
    const { tasks, meta } = await taskService.getSingleNotepadTasks(
      param(req, 'notepadId'),
      req.userId,
      getValidatedTaskParams(req),
    );

    res.status(200).json({ message: 'Success', data: tasks, meta });
  },
);

taskRouter.get(ROUTES.tasks.byId, expressAuthMiddleware, async (req, res) =>
  getTask(req, res, COMMON_NOTEPAD_ID),
);

taskRouter.get(
  ROUTES.notepads.taskDetail,
  expressAuthMiddleware,
  async (req, res) => getTask(req, res, param(req, 'notepadId')),
);

taskRouter.patch(
  ROUTES.tasks.byId,
  expressAuthMiddleware,
  expressCheckContentType,
  updateTask,
);

taskRouter.patch(
  ROUTES.notepads.taskDetail,
  expressAuthMiddleware,
  expressCheckContentType,
  updateTask,
);

taskRouter.delete(ROUTES.tasks.byId, expressAuthMiddleware, deleteTask);

taskRouter.delete(
  ROUTES.notepads.taskDetail,
  expressAuthMiddleware,
  deleteTask,
);
