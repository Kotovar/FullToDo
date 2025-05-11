import http, { type IncomingMessage, type ServerResponse } from 'http';
import morgan from 'morgan';
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

const NOTEPAD_TASKS_REGEX = new RegExp(
  `^${ROUTES.NOTEPAD_TASKS.replace(':notepadId', '([^/]+)')}$`,
);

const NOTEPAD_ID_REGEX = new RegExp(
  `^${ROUTES.NOTEPAD_ID.replace(':notepadId', '([^/]+)')}$`,
);

const TASK_DETAIL_REGEX = new RegExp(
  `^${ROUTES.TASK_DETAIL.replace(':notepadId', '([^/]+)').replace(
    ':taskId',
    '([^/]+)',
  )}$`,
);

const logger = morgan('tiny');

export const routes: Record<
  string,
  (context: { req: IncomingMessage; res: ServerResponse }) => Promise<unknown>
> = {
  [`GET ${ROUTES.TASKS}`]: context => getAllTasks(context, taskRepository),
  [`GET ${ROUTES.TODAY_TASKS}`]: context =>
    getTodayTasks(context, taskRepository),
  [`GET ${ROUTES.NOTEPADS}`]: context =>
    getAllNotepads(context, taskRepository),
  [`POST ${ROUTES.NOTEPADS}`]: context =>
    createNotepad(context, taskRepository),
};

export const createHttpServer = () => {
  const server = http.createServer((req, res) => {
    logger(req, res, () => {});

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS',
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = req.url?.split('?')[0];
    const key = `${req.method} ${url}`;

    if (routes[key]) {
      return routes[key]({ req, res });
    }

    const notepadTasksMatch = url?.match(NOTEPAD_TASKS_REGEX);
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

    const taskDetailMatch = url?.match(TASK_DETAIL_REGEX);

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

    const notepadMatch = url?.match(NOTEPAD_ID_REGEX);

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

    handleNotFound(res);
  });

  return server;
};
