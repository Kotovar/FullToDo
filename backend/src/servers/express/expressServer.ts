import express from 'express';
import { expressErrorHandler, expressNotFoundHandler } from '@controllers';
import { setHeaders } from '..';
import { expressRouter } from './routes';

export const createExpressServer = () => {
  const app = express();

  app.use((req, res, next) => {
    setHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  });

  app.use(express.json());

  app.use(expressRouter);

  app.use(expressNotFoundHandler);
  app.use(expressErrorHandler);

  return app;
};
