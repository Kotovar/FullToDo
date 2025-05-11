import http from 'http';
import { ROUTE_REGEX } from './routeRegex';
import { taskRepository } from '../../repositories';
import { ROUTES } from '@shared/routes';
import type { RequestHandler } from '../../controllers/types';
import * as controllers from '../../controllers';

export const BASE_ROUTES: Record<string, RequestHandler> = {
  [`POST ${ROUTES.NOTEPADS}`]: controllers.createNotepad,
  [`POST ${ROUTES.TASKS}`]: controllers.createTask,
  [`GET ${ROUTES.NOTEPADS}`]: controllers.getAllNotepads,
  [`GET ${ROUTES.TASKS}`]: controllers.getAllTasks,
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
        return controllers.createTask({ req, res }, taskRepository);
      case 'GET':
        return controllers.getSingleNotepadTasks({ req, res }, taskRepository);
      default:
        return controllers.handleNotFound(res);
    }
  }

  const commonTaskDetailMatch = url.match(ROUTE_REGEX.COMMON_TASK_DETAIL);

  if (commonTaskDetailMatch) {
    switch (req.method) {
      case 'GET':
        return controllers.getSingleTask({ req, res }, taskRepository);
      case 'PATCH':
        return controllers.updateTask({ req, res }, taskRepository);
      case 'DELETE':
        return controllers.deleteTask({ req, res }, taskRepository);
      default:
        return controllers.handleNotFound(res);
    }
  }

  const taskDetailMatch = url.match(ROUTE_REGEX.TASK_DETAIL);

  if (taskDetailMatch) {
    switch (req.method) {
      case 'GET':
        return controllers.getSingleTask({ req, res }, taskRepository);
      case 'PATCH':
        return controllers.updateTask({ req, res }, taskRepository);
      case 'DELETE':
        return controllers.deleteTask({ req, res }, taskRepository);
      default:
        return controllers.handleNotFound(res);
    }
  }

  const notepadMatch = url.match(ROUTE_REGEX.NOTEPAD_ID);

  if (notepadMatch) {
    switch (req.method) {
      case 'PATCH':
        return controllers.updateNotepad({ req, res }, taskRepository);
      case 'DELETE':
        return controllers.deleteNotepad({ req, res }, taskRepository);
      default:
        return controllers.handleNotFound(res);
    }
  }

  return null;
};
