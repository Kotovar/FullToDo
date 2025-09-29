import { Task, PAGINATION } from '@sharedCommon/schemas';

export const getMetaMock = (tasks: Task[]) => ({
  limit: PAGINATION.DEFAULT_LIMIT,
  page: 1,
  total: tasks.length,
  totalPages: Math.ceil(tasks.length / PAGINATION.DEFAULT_LIMIT),
});
