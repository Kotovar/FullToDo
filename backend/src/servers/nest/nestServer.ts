import 'reflect-metadata';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { expressErrorHandler, expressNotFoundHandler } from '@controllers';
import { expressRouter } from '../express/routes';
import { setHeaders } from '../utils';
import { AppModule } from './app.module';

export const createNestServer = async () => {
  const expressApp = express();

  expressApp.use((req, res, next) => {
    setHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  });

  expressApp.use(express.json());

  expressApp.use(expressRouter);

  expressApp.use(expressNotFoundHandler);
  expressApp.use(expressErrorHandler);

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      logger: false,
    },
  );

  await app.init();

  return expressApp;
};
