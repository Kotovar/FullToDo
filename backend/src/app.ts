import { config } from 'dotenv';
import path from 'path';
import { createHttpServer, createExpressServer } from './servers';

config({ path: path.resolve(__dirname, '../../.env') });

const SERVER_TYPE = process.env.SERVER_TYPE || 'http';
const PORT = Number(process.env.PORT) || 3000;

const server =
  SERVER_TYPE === 'express' ? createExpressServer() : createHttpServer();

server.listen(PORT);
