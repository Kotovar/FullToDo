import http from 'http';
import { handleNotFound } from '@controllers';
import { handleRoute } from './routes';
import { httpLogger } from '@logger/http';
import { setHeaders } from '..';

export const extractPath = (reqUrl?: string): string | undefined => {
  const { 0: url } = reqUrl?.split('?') ?? [];
  return url;
};

export const createHttpServer = () => {
  const server = http.createServer((req, res) => {
    setHeaders(req, res);
    httpLogger?.info({ method: req.method, url: req.url }, 'Incoming request');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = extractPath(req.url);

    if (!handleRoute({ req, res }, url)) {
      handleNotFound(res);
    }
  });

  return server;
};
