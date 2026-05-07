import 'reflect-metadata';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { expressErrorHandler, expressNotFoundHandler } from '@controllers';
import { expressRouter } from '../express/routes';
import { AppErrorFilter } from './common/app-error.filter';
import { nestHeadersMiddleware } from './common/headers.middleware';
import { AppModule } from './app.module';

export const createNestServer = async () => {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      logger: false,
    },
  );

  app.use(nestHeadersMiddleware);
  app.use(express.json());
  app.use(expressRouter);
  app.useGlobalFilters(new AppErrorFilter());

  await app.init();

  expressApp.use(expressNotFoundHandler);
  expressApp.use(expressErrorHandler);

  return expressApp;
};
