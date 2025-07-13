export * from './TaskRepository';
export * from './MockTaskRepository';

import { config } from '@configs';
import MockTaskRepository from './MockTaskRepository';

const {
  db: { type },
} = config;

export const taskRepository = (() => {
  switch (type) {
    case 'mongo':
      return MockTaskRepository;
    case 'postgres':
      return MockTaskRepository;
    default:
      return MockTaskRepository;
  }
})();
