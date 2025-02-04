import { config } from 'dotenv';
import MockTaskRepository from './MockTaskRepository';

config();

export const taskRepository = (() => {
  switch (process.env.DB_TYPE) {
    case 'mongo':
      return MockTaskRepository;
    case 'postgres':
      return MockTaskRepository;
    default:
      return MockTaskRepository;
  }
})();
