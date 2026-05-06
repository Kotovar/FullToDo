import express, {
  type NextFunction,
  type Response,
  type Request,
} from 'express';
import { expressErrorHandler, expressNotFoundHandler } from '@controllers';
import { expressRouter } from './routes';
import { setHeaders } from '..';

const headersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  setHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
};

export const createExpressServer = () => {
  const app = express();

  app.use(headersMiddleware);

  app.use(express.json());

  app.use(expressRouter);

  app.use(expressNotFoundHandler);
  app.use(expressErrorHandler);

  return app;
};
