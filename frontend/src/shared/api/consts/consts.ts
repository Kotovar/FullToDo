import type {
  BaseErrorType,
  EntityErrorType,
  ErrorDetail,
  ErrorType,
} from '../types';

export const URL = import.meta.env.VITE_URL;
export const HEADERS = { 'Content-Type': 'application/json' };

export const COMMON_ERRORS: Record<BaseErrorType, ErrorDetail> = {
  SERVER_ERROR: {
    type: 'SERVER_ERROR',
    message: 'errors.common.SERVER_ERROR',
  },
  NETWORK_ERROR: {
    type: 'NETWORK_ERROR',
    message: 'errors.common.NETWORK_ERROR',
  },
  URL: {
    type: 'URL',
    message: 'errors.common.URL',
  },
  JSON: {
    type: 'JSON',
    message: 'errors.common.JSON',
  },
} as const;

export const NOTEPAD_ERRORS: Record<EntityErrorType, ErrorDetail> = {
  CONFLICT: {
    type: 'CONFLICT',
    message: 'errors.notepad.CONFLICT',
  },
  UNDEFINED: {
    type: 'UNDEFINED',
    message: 'errors.notepad.UNDEFINED',
  },
  ...COMMON_ERRORS,
} as const;

export const AUTH_ERRORS: Record<ErrorType, ErrorDetail> = {
  CONFLICT: {
    type: 'CONFLICT',
    message: 'errors.auth.CONFLICT',
  },
  UNAUTHORIZED: {
    type: 'UNAUTHORIZED',
    message: 'errors.auth.UNAUTHORIZED',
  },
  EMAIL_NOT_VERIFIED: {
    type: 'EMAIL_NOT_VERIFIED',
    message: 'errors.auth.EMAIL_NOT_VERIFIED',
  },
  TOO_MANY_REQUESTS: {
    type: 'TOO_MANY_REQUESTS',
    message: 'errors.auth.TOO_MANY_REQUESTS',
  },
  UNDEFINED: {
    type: 'UNDEFINED',
    message: 'errors.auth.UNDEFINED',
  },
  ...COMMON_ERRORS,
} as const;

export const TASKS_ERRORS: Record<EntityErrorType, ErrorDetail> = {
  CONFLICT: {
    type: 'CONFLICT',
    message: 'errors.tasks.CONFLICT',
  },
  UNDEFINED: {
    type: 'UNDEFINED',
    message: 'errors.tasks.UNDEFINED',
  },
  ...COMMON_ERRORS,
} as const;
