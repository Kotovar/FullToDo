export type MutationMethods = 'create' | 'update' | 'delete';

export type QueryError = {
  type: 'CONFLICT' | 'SERVER_ERROR';
  message:
    | 'errors.notepad.CONFLICT'
    | 'errors.tasks.CONFLICT'
    | 'errors.common.SERVER_ERROR';
};
