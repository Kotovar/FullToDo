import express from 'express';

import { taskRepository } from '../../repositories';
import { getAllNotepads } from '../../controllers/requestNotepads';

export const createExpressServer = (port: number) => {
  const app = express();

  app.all('*', (req, res) => {
    return getAllNotepads({ serverType: 'express', req, res }, taskRepository);
  });

  app.listen(port);
};
