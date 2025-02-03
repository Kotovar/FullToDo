import http from 'http';
import {
  getAllTasks,
  getTasksByNotepad,
  getTasksWithDueDate,
} from '../controllers/tasksMock';

export const createHttpServer = (port: number) => {
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/notepad/all') {
      return getAllTasks(req, res);
    }

    if (req.method === 'GET' && req.url === '/notepad/today') {
      return getTasksWithDueDate(new Date(), res);
    }

    if (req.method === 'GET' && req.url?.startsWith('/notepad/')) {
      const id = req.url?.split('/notepad/')[1];

      if (!id) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Notepad ID is required' }));
      }

      return getTasksByNotepad(id, res);
    }

    res.statusCode = 404;
    res.end('Not Found');
  });

  server.listen(port);
};
