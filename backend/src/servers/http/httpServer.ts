import http from 'http';
import { handleNotFound } from '@controllers';
import { handleRoute } from './routes';
import { httpLogger } from '@logger/http';

const setHeaders = (res: http.ServerResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export const extractPath = (reqUrl?: string): string | undefined => {
  const { 0: url } = reqUrl?.split('?') ?? [];
  return url;
};

export const createHttpServer = () => {
  const server = http.createServer((req, res) => {
    setHeaders(res);
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
