import { createHttpServer, createExpressServer } from './servers';
import { config } from './configs';

const {
  server: { type, port },
} = config;

const server = type === 'express' ? createExpressServer() : createHttpServer();

server.listen(port);
