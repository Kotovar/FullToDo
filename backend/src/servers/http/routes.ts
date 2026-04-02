import { ROUTE_REGEX } from './routeRegex';
import { ROUTES } from '@sharedCommon/routes';
import {
  createNotepad,
  createTask,
  deleteNotepad,
  deleteTask,
  getAllNotepads,
  getAllTasks,
  getSingleNotepadTasks,
  getSingleTask,
  handleNotFound,
  updateNotepad,
  updateTask,
} from '@controllers';
import { taskRepository } from '@repositories';
import { TaskService } from '@services/TaskService';
import { NotepadService } from '@services/NotepadService';
import type { HttpContext } from '@controllers/types';

const taskService = new TaskService(taskRepository);
const notepadService = new NotepadService(taskRepository);

type RouteHandler = (ctx: HttpContext) => Promise<void>;

export const BASE_ROUTES: Record<string, RouteHandler> = {
  [`POST ${ROUTES.NOTEPADS}`]: ctx => createNotepad(ctx, notepadService),
  [`POST ${ROUTES.TASKS}`]: ctx => createTask(ctx, taskService),
  [`GET ${ROUTES.NOTEPADS}`]: ctx => getAllNotepads(ctx, notepadService),
  [`GET ${ROUTES.TASKS}`]: ctx => getAllTasks(ctx, taskService),
};

export const handleRoute = (ctx: HttpContext, url?: string): boolean => {
  if (!url) return false;

  const { req, res } = ctx;
  const routeKey = `${ctx.req.method} ${url}`;

  if (BASE_ROUTES[routeKey]) {
    BASE_ROUTES[routeKey](ctx);
    return true;
  }

  if (url.match(ROUTE_REGEX.NOTEPAD_TASKS)) {
    switch (req.method) {
      case 'POST':
        createTask(ctx, taskService);
        break;
      case 'GET':
        getSingleNotepadTasks(ctx, taskService);
        break;
      default:
        handleNotFound(res);
    }

    return true;
  }

  if (url.match(ROUTE_REGEX.COMMON_TASK_DETAIL)) {
    switch (req.method) {
      case 'GET':
        getSingleTask(ctx, taskService);
        break;
      case 'PATCH':
        updateTask(ctx, taskService);
        break;
      case 'DELETE':
        deleteTask(ctx, taskService);
        break;
      default:
        handleNotFound(res);
    }

    return true;
  }

  if (url.match(ROUTE_REGEX.TASK_DETAIL)) {
    switch (req.method) {
      case 'GET':
        getSingleTask(ctx, taskService);
        break;
      case 'PATCH':
        updateTask(ctx, taskService);
        break;
      case 'DELETE':
        deleteTask(ctx, taskService);
        break;
      default:
        handleNotFound(res);
    }

    return true;
  }

  if (url.match(ROUTE_REGEX.NOTEPAD_ID)) {
    switch (req.method) {
      case 'PATCH':
        updateNotepad(ctx, notepadService);
        break;
      case 'DELETE':
        deleteNotepad(ctx, notepadService);
        break;
      default:
        handleNotFound(res);
    }
    return true;
  }

  return false;
};
