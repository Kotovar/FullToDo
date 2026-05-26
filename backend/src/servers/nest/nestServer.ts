import 'reflect-metadata';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';
import { expressErrorHandler, expressNotFoundHandler } from '@controllers';
import { swaggerSpec } from '@swagger/spec';
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
  app.useGlobalFilters(new AppErrorFilter());

  SwaggerModule.setup('api-docs', app, swaggerSpec as OpenAPIObject, {
    jsonDocumentUrl: '/api-docs/spec.json',
    customSiteTitle: 'FullToDo API',
  });

  await app.init();

  expressApp.use(expressNotFoundHandler);
  expressApp.use(expressErrorHandler);

  return expressApp;
};
