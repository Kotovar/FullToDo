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

const NOTEPAD_ID_REGEX = new RegExp(
  `^${ROUTES.NOTEPAD_ID.replace(':notepadId', '([^/]+)')}$`,
);
const NOTEPAD_CREATE_TASK_REGEX = new RegExp(
  `^${ROUTES.NOTEPAD_ID.replace(':notepadId', '([^/]+)')}/task$`,
);
const TASK_ID_REGEX = new RegExp(
  `^${ROUTES.TASK_ID.replace(':notepadId', '([^/]+)').replace(':taskId', '([^/]+)')}$`,
);

const logger = morgan('tiny');

export const routes: Record<
  string,
  (context: { req: IncomingMessage; res: ServerResponse }) => Promise<unknown>
> = {
  [`GET ${ROUTES.ALL_TASKS}`]: context => getAllTasks(context, taskRepository),
  [`GET ${ROUTES.NOTEPAD}`]: context => getAllNotepads(context, taskRepository),
  [`GET ${ROUTES.TODAY_TASKS}`]: context =>
    getTodayTasks(context, taskRepository),
  [`POST ${ROUTES.NOTEPAD}`]: context => createNotepad(context, taskRepository),
};

export const createHttpServer = () => {
  const server = http.createServer((req, res) => {
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

    logger(req, res, () => {});

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

  return server;
};
