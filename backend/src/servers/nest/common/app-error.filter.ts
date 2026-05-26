import {
  Catch,
  HttpException,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import { AppError } from '@errors/AppError';
import { repositoryLogger } from '@logger';
import { ZodValidationError } from './zod-validation.pipe';

const getHttpExceptionStatus = (error: HttpException) => error.getStatus();

/**
 * Глобальный Nest filter для совместимого JSON-формата ошибок.
 *
 * Сохраняет текущий контракт Express/HTTP adapters:
 * - AppError -> `{ error: { statusCode, message } }`
 * - Zod validation -> `{ message: 'Invalid data', errors }`
 * - неожиданные ошибки -> `{ error: 'Internal Server Error' }`
 */
@Catch()
export class AppErrorFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (error instanceof ZodValidationError) {
      response.status(400).json({
        message: 'Invalid data',
        errors: error.error,
      });
      return;
    }

    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        error: {
          statusCode: error.statusCode,
          message: error.message,
        },
      });
      return;
    }

    const statusCode =
      error instanceof HttpException ? getHttpExceptionStatus(error) : 500;

    if (statusCode >= 500) {
      repositoryLogger.error({ err: error }, 'Unhandled error');
    }

    response
      .status(statusCode)
      .json(
        statusCode === 400
          ? { error: 'Bad Request' }
          : { error: 'Internal Server Error' },
      );
  }
}
