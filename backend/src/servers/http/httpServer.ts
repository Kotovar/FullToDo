import http, { IncomingMessage, ServerResponse } from 'http';
import { taskRepository } from '../../repositories';
import { ROUTES } from '@shared/routes';
import {
  getAllTasks,
  getTodayTasks,
  getSingleNotepadTasks,
  createNotepad,
  getAllNotepads,
  handleNotFound,
  createTask,
  deleteTask,
  updateTask,
  getSingleTask,
} from '../../controllers';

export const routes: Record<
  string,
  (context: { req: IncomingMessage; res: ServerResponse }) => Promise<unknown>
> = {
  [`GET ${ROUTES.ALL_TASKS}`]: context => getAllTasks(context, taskRepository),
  [`GET ${ROUTES.NOTEPADS}`]: context =>
    getAllNotepads(context, taskRepository),
  [`GET ${ROUTES.TODAY_TASKS}`]: context =>
    getTodayTasks(context, taskRepository),
  [`POST ${ROUTES.NOTEPADS}`]: context =>
    createNotepad(context, taskRepository),
};

export const createHttpServer = (port: number) => {
  const server = http.createServer((req, res) => {
    const key = `${req.method} ${req.url}`;

    if (routes[key]) {
      return routes[key]({ req, res });
    }

    const notepadMatch = req.url?.match(
      new RegExp(`^${ROUTES.NOTEPAD_ID.replace(':notepadId', '([^/]+)')}$`),
    );

    if (notepadMatch) {
      return req.method === 'GET'
        ? getSingleNotepadTasks({ req, res }, taskRepository)
        : handleNotFound(res);
    }

    const taskMatch = req.url?.match(
      new RegExp(
        `^${ROUTES.TASK_ID.replace(':notepadId', '([^/]+)').replace(':taskId', '([^/]+)')}$`,
      ),
    );

    if (taskMatch) {
      switch (req.method) {
        case 'GET':
          return getSingleTask({ req, res }, taskRepository);
        case 'POST':
          return createTask({ req, res }, taskRepository);
        case 'DELETE':
          return deleteTask({ req, res }, taskRepository);
        case 'PUT':
          return updateTask({ req, res }, taskRepository);
        default:
          return handleNotFound(res);
      }
    }

    handleNotFound(res);
  });

  server.listen(port);
};
