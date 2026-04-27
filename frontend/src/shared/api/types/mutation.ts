import type { Translation } from '@shared/i18n';

type TranslationKeys = Extract<
  Translation,
  | 'errors.common.SERVER_ERROR'
  | 'errors.common.NETWORK_ERROR'
  | 'errors.common.JSON'
  | 'errors.common.URL'
  | 'errors.auth.CONFLICT'
  | 'errors.auth.UNAUTHORIZED'
  | 'errors.auth.EMAIL_NOT_VERIFIED'
  | 'errors.auth.TOO_MANY_REQUESTS'
  | 'errors.auth.UNDEFINED'
  | 'errors.notepad.CONFLICT'
  | 'errors.notepad.UNDEFINED'
  | 'errors.tasks.CONFLICT'
  | 'errors.tasks.UNDEFINED'
>;

export type MutationMethods = 'create' | 'update' | 'delete';

export type QueryError = {
  type:
    | 'CONFLICT'
    | 'SERVER_ERROR'
    | 'UNAUTHORIZED'
    | 'UNDEFINED'
    | 'TOO_MANY_REQUESTS';
  message:
    | 'errors.auth.CONFLICT'
    | 'errors.auth.UNAUTHORIZED'
    | 'errors.auth.EMAIL_NOT_VERIFIED'
    | 'errors.auth.TOO_MANY_REQUESTS'
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
  | 'EMAIL_NOT_VERIFIED'
  | 'TOO_MANY_REQUESTS'
  | 'NETWORK_ERROR'
  | 'URL'
  | 'JSON';

export type BaseErrorType = Extract<
  ErrorType,
  'SERVER_ERROR' | 'NETWORK_ERROR' | 'URL' | 'JSON'
>;

export type EntityErrorType = Exclude<
  ErrorType,
  'UNAUTHORIZED' | 'EMAIL_NOT_VERIFIED' | 'TOO_MANY_REQUESTS'
>;

export type ErrorDetail = {
  type: ErrorType;
  message: TranslationKeys;
};
