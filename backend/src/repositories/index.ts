export * from './interfaces/TaskRepository';

import { config } from '@configs';
import { MockTaskRepository } from './mock/MockTaskRepository';
import { PostgresTaskRepository } from './postgres/PostgresTaskRepository';
import { NOTEPADS } from '@db/mock/mock-db';
import type { TaskRepository } from './interfaces/TaskRepository';

const {
  db: { type },
} = config;

export const taskRepository: TaskRepository = (() => {
  switch (type) {
    case 'mongo':
      return new MockTaskRepository(NOTEPADS);
    case 'postgres':
      return new PostgresTaskRepository();
    default:
      return new MockTaskRepository(NOTEPADS);
  }
})();
