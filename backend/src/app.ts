import { config } from 'dotenv';
import { createHttpServer, createExpressServer } from './servers';

config();

const SERVER_TYPE = process.env.SERVER_TYPE || 'http';
const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
  if (SERVER_TYPE === 'express') {
    createExpressServer(PORT);
  } else {
    createHttpServer(PORT);
  }
};

startServer();
