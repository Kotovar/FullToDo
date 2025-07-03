export const URL = import.meta.env.VITE_URL;
export const HEADERS = { 'Content-Type': 'application/json' };

export type ErrorDetail = {
  type: ErrorType;
  message: TranslationKeys | string;
};

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
    message: 'VITE_URL is not defined in .env file',
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

export type ErrorType =
  | 'CONFLICT'
  | 'SERVER_ERROR'
  | 'UNDEFINED'
  | 'NETWORK_ERROR'
  | 'URL'
  | 'JSON';

type TranslationKeys =
  | 'errors.common.SERVER_ERROR'
  | 'errors.common.NETWORK_ERROR'
  | 'errors.common.JSON'
  | 'errors.notepad.CONFLICT'
  | 'errors.notepad.UNDEFINED'
  | 'errors.tasks.CONFLICT'
  | 'errors.tasks.UNDEFINED';

type BaseErrorType = Extract<
  ErrorType,
  'SERVER_ERROR' | 'NETWORK_ERROR' | 'URL' | 'JSON'
>;
