import http from 'http';
import { handleRequest } from '../../controllers/requestHandler';
import { taskRepository } from '../../repositories';

export const createHttpServer = (port: number) => {
  const server = http.createServer((req, res) => {
    handleRequest({ serverType: 'http', req, res }, taskRepository);
  });

  server.listen(port);
};
