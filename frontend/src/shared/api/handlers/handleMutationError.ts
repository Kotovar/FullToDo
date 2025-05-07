import type { QueryError } from '@shared/api';

const isEntityError = (cause: unknown): cause is QueryError =>
  typeof cause === 'object' &&
  cause !== null &&
  Object.hasOwn(cause, 'type') &&
  Object.hasOwn(cause, 'message');

export const handleMutationError = (error: unknown): QueryError => {
  if (error instanceof Error && isEntityError(error.cause)) {
    return error.cause;
  }
  return {
    type: 'SERVER_ERROR',
    message: 'Неизвестная ошибка',
  };
};
