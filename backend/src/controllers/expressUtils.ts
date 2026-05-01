import type { ErrorRequestHandler, RequestHandler, Response } from 'express';
import type { ZodError } from 'zod';
import { AppError } from '@errors/AppError';
import { repositoryLogger } from '@logger';

export const expressNotFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

export const expressHandleValidationError = (
  res: Response,
  error: ZodError,
) => {
  res.status(400).json({
    message: 'Invalid data',
    errors: error,
  });
};

const getErrorStatusCode = (error: unknown) => {
  if (error instanceof AppError) return error.statusCode;

  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number'
  ) {
    return error.status;
  }

  return 500;
};

/**
 * Централизованный обработчик ошибок для express.
 */
export const expressErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  const statusCode = getErrorStatusCode(error);

  if (statusCode >= 500) {
    repositoryLogger.error({ err: error }, 'Unhandled error');
  }

  if (error instanceof AppError) {
    res.status(statusCode).json({
      error: {
        statusCode: error.statusCode,
        message: error.message,
      },
    });
    return;
  }

  res
    .status(statusCode)
    .json(
      statusCode === 400
        ? { error: 'Bad Request' }
        : { error: 'Internal Server Error' },
    );
};
