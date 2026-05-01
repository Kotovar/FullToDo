import '@swagger/extend';
import { Server as HttpServer } from 'http';
import type { Application } from 'express';
import { createHttpServer, createExpressServer } from './servers';
import { config, ServerType } from './configs';
import { initializePostgres } from '@db/postgres';
import { connectRedis } from '@db/redis';
import { initializeMongo } from '@db/mongo';
import { serverLogger } from './logger';
import { registerGlobalErrorHandlers } from '@errors/uncaughtException';

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

const app = servers[type]();

const exitOnStartupError = (message: string) => (err: unknown) => {
  serverLogger.error({ err }, message);
  process.exit(1);
};

const startDependencies = async () => {
  if (dbType === 'postgres') {
    await initializePostgres();
  }

  if (dbType === 'mongo') {
    await initializeMongo();
  }

  await connectRedis();
};

const start = async () => {
  await startDependencies();

  const server = app.listen(port, () => {
    serverLogger.info({ port }, 'Server started');
  });

  server.on('error', exitOnStartupError('Server failed to start'));

  return server;
};

const httpServerPromise = start().catch(
  exitOnStartupError('Server dependencies failed'),
);

registerGlobalErrorHandlers(httpServerPromise);
