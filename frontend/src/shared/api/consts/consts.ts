import type { BaseErrorType, ErrorDetail, ErrorType } from '../types';

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

export const NOTEPAD_ERRORS: Record<ErrorType, ErrorDetail> = {
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

export const TASKS_ERRORS: Record<ErrorType, ErrorDetail> = {
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
