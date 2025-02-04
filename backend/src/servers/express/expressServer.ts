import express from 'express';
import { handleRequest } from '../../controllers/requestHandler';
import { taskRepository } from '../../repositories';

export const createExpressServer = (port: number) => {
  const app = express();

  app.all('*', (req, res) => {
    handleRequest({ serverType: 'express', req, res }, taskRepository);
  });

  app.listen(port);
};
