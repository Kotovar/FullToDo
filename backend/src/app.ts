import '@swagger/extend';
import { Server as HttpServer } from 'http';
import type { Application } from 'express';
import {
  createHttpServer,
  createExpressServer,
  createNestServer,
} from './servers';
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

type ServerFactory = () =>
  | Promise<HttpServer | Application>
  | HttpServer
  | Application;

const servers: Record<ServerType, ServerFactory> = {
  http: createHttpServer,
  express: createExpressServer,
  nestJs: createNestServer,
};

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

  const app = await servers[type]();

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
