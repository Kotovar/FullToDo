export * from './TaskRepository';

import { config } from '@configs';
import { MockTaskRepository } from './MockTaskRepository';
import { PostgresTaskRepository } from './PostgresTaskRepository';
import { NOTEPADS } from '@db/mock/mock-db';
import type { TaskRepository } from './TaskRepository';

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
