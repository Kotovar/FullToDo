import type { Server as HttpServer } from 'http';
import type { Application } from 'express';
import { createHttpServer, createExpressServer } from './servers';
import { config, ServerType } from './configs';
import { initDb } from '@db/postgres';

const {
  server: { type, port },
  db: { type: dbType },
} = config;

const servers: Record<ServerType, () => HttpServer | Application> = {
  http: createHttpServer,
  express: createExpressServer,
  // TODO: Заменить после реализации nextJs сервера
  nextJs: createExpressServer,
};

const server = servers[type]();

server.listen(port);

if (dbType === 'postgres') {
  initDb();
}
