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
  updateNotepad,
  getSingleTask,
  deleteNotepad,
} from '../../controllers';

const NOTEPAD_ID_REGEX = new RegExp(
  `^${ROUTES.NOTEPAD_ID.replace(':notepadId', '([^/]+)')}$`,
);
const NOTEPAD_CREATE_TASK_REGEX = new RegExp(
  `^${ROUTES.NOTEPAD_ID.replace(':notepadId', '([^/]+)')}/task$`,
);
const TASK_ID_REGEX = new RegExp(
  `^${ROUTES.TASK_ID.replace(':notepadId', '([^/]+)').replace(':taskId', '([^/]+)')}$`,
);

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

    const notepadMatch = req.url?.match(NOTEPAD_ID_REGEX);

    if (notepadMatch) {
      switch (req.method) {
        case 'GET':
          return getSingleNotepadTasks({ req, res }, taskRepository);
        case 'DELETE':
          return deleteNotepad({ req, res }, taskRepository);
        case 'PATCH':
          return updateNotepad({ req, res }, taskRepository);
        default:
          return handleNotFound(res);
      }
    }

    const notepadCreateTaskMatch = req.url?.match(NOTEPAD_CREATE_TASK_REGEX);

    if (notepadCreateTaskMatch && req.method === 'POST') {
      return createTask({ req, res }, taskRepository);
    }

    const taskMatch = req.url?.match(new RegExp(TASK_ID_REGEX));

    if (taskMatch) {
      switch (req.method) {
        case 'GET':
          return getSingleTask({ req, res }, taskRepository);
        case 'DELETE':
          return deleteTask({ req, res }, taskRepository);
        case 'PATCH':
          return updateTask({ req, res }, taskRepository);
        default:
          return handleNotFound(res);
      }
    }

    handleNotFound(res);
  });

  server.listen(port);
};
