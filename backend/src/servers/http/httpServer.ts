import http from 'http';
import {
  getAllTasks,
  getTodayTasks,
  handleNotFound,
  getSingleNotepadTasks,
} from '../../controllers/requestTasks';
import { taskRepository } from '../../repositories';

import { ROUTES } from '@shared/routes';
import { getAllNotepads } from '../../controllers/requestNotepads';

export const createHttpServer = (port: number) => {
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === ROUTES.NOTEPADS) {
      return getAllNotepads({ serverType: 'http', req, res }, taskRepository);
    }

    if (req.method === 'GET' && req.url === ROUTES.ALL_TASKS) {
      return getAllTasks({ serverType: 'http', req, res }, taskRepository);
    }

    if (req.method === 'GET' && req.url === ROUTES.TODAY_TASKS) {
      return getTodayTasks({ serverType: 'http', req, res }, taskRepository);
    }

    if (req.method === 'GET' && req.url?.startsWith(ROUTES.NOTEPADS)) {
      return getSingleNotepadTasks(
        { serverType: 'http', req, res },
        taskRepository,
      );
    }

    handleNotFound(res);
  });

  server.listen(port);
};
