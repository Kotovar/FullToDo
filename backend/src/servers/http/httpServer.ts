import http from 'http';
import morgan from 'morgan';
import { taskRepository } from '../../repositories';
import { BASE_ROUTES, processRoute } from './routes';
import { handleNotFound } from '../../controllers';

const logger = morgan('tiny');

const setHeaders = (res: http.ServerResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export const createHttpServer = () => {
  const server = http.createServer((req, res) => {
    logger(req, res, () => {});
    setHeaders(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const [url] = req.url?.split('?') ?? [];
    const routeKey = `${req.method} ${url}`;

    if (BASE_ROUTES[routeKey]) {
      return BASE_ROUTES[routeKey]({ req, res }, taskRepository);
    }

    const routeResult = processRoute(req, res, url);

    if (!routeResult) {
      return handleNotFound(res);
    }
  });

  return server;
};
