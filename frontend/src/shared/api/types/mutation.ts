export type MutationMethods = 'create' | 'update' | 'delete';

export type QueryError = {
  type: 'CONFLICT' | 'SERVER_ERROR';
  message: string;
};
