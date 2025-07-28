import http from 'http';
import { ROUTE_REGEX } from './routeRegex';
import { ROUTES } from '@sharedCommon/routes';
import { taskRepository } from '@repositories';
import type { RequestHandler } from '@controllers/types';
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

export const BASE_ROUTES: Record<string, RequestHandler> = {
  [`POST ${ROUTES.NOTEPADS}`]: createNotepad,
  [`POST ${ROUTES.TASKS}`]: createTask,
  [`GET ${ROUTES.NOTEPADS}`]: getAllNotepads,
  [`GET ${ROUTES.TASKS}`]: getAllTasks,
};

export const processRoute = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  url?: string,
) => {
  if (!url) return null;

  const notepadTasksMatch = url.match(ROUTE_REGEX.NOTEPAD_TASKS);

  if (notepadTasksMatch) {
    switch (req.method) {
      case 'POST':
        return createTask({ req, res }, taskRepository);
      case 'GET':
        return getSingleNotepadTasks({ req, res }, taskRepository);
      default:
        return handleNotFound(res);
    }
  }

  const commonTaskDetailMatch = url.match(ROUTE_REGEX.COMMON_TASK_DETAIL);

  if (commonTaskDetailMatch) {
    switch (req.method) {
      case 'GET':
        return getSingleTask({ req, res }, taskRepository);
      case 'PATCH':
        return updateTask({ req, res }, taskRepository);
      case 'DELETE':
        return deleteTask({ req, res }, taskRepository);
      default:
        return handleNotFound(res);
    }
  }

  const taskDetailMatch = url.match(ROUTE_REGEX.TASK_DETAIL);

  if (taskDetailMatch) {
    switch (req.method) {
      case 'GET':
        return getSingleTask({ req, res }, taskRepository);
      case 'PATCH':
        return updateTask({ req, res }, taskRepository);
      case 'DELETE':
        return deleteTask({ req, res }, taskRepository);
      default:
        return handleNotFound(res);
    }
  }

  const notepadMatch = url.match(ROUTE_REGEX.NOTEPAD_ID);

  if (notepadMatch) {
    switch (req.method) {
      case 'PATCH':
        return updateNotepad({ req, res }, taskRepository);
      case 'DELETE':
        return deleteNotepad({ req, res }, taskRepository);
      default:
        return handleNotFound(res);
    }
  }

  return null;
};
