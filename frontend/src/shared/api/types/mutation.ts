import type { Translation } from '@shared/i18n';

type TranslationKeys = Extract<
  Translation,
  | 'errors.common.SERVER_ERROR'
  | 'errors.common.NETWORK_ERROR'
  | 'errors.common.JSON'
  | 'errors.common.URL'
  | 'errors.auth.CONFLICT'
  | 'errors.auth.UNAUTHORIZED'
  | 'errors.auth.UNDEFINED'
  | 'errors.notepad.CONFLICT'
  | 'errors.notepad.UNDEFINED'
  | 'errors.tasks.CONFLICT'
  | 'errors.tasks.UNDEFINED'
>;

export type MutationMethods = 'create' | 'update' | 'delete';

export type QueryError = {
  type: 'CONFLICT' | 'SERVER_ERROR' | 'UNAUTHORIZED' | 'UNDEFINED';
  message:
    | 'errors.auth.CONFLICT'
    | 'errors.auth.UNAUTHORIZED'
    | 'errors.auth.UNDEFINED'
    | 'errors.notepad.CONFLICT'
    | 'errors.tasks.CONFLICT'
    | 'errors.common.SERVER_ERROR'
    | 'errors.notepad.UNDEFINED'
    | 'errors.tasks.UNDEFINED';
};

export type ErrorType =
  | 'CONFLICT'
  | 'SERVER_ERROR'
  | 'UNDEFINED'
  | 'UNAUTHORIZED'
  | 'NETWORK_ERROR'
  | 'URL'
  | 'JSON';

export type BaseErrorType = Extract<
  ErrorType,
  'SERVER_ERROR' | 'NETWORK_ERROR' | 'URL' | 'JSON'
>;

export type EntityErrorType = Exclude<ErrorType, 'UNAUTHORIZED'>;

export type ErrorDetail = {
  type: ErrorType;
  message: TranslationKeys;
};
