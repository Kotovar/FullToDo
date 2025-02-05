import { config } from 'dotenv';
import MockTaskRepository from './MockTaskRepository';

config();

const DB_TYPE = process.env.DB_TYPE || 'mock';

export const taskRepository = (() => {
  switch (DB_TYPE) {
    case 'mongo':
      return MockTaskRepository;
    case 'postgres':
      return MockTaskRepository;
    default:
      return MockTaskRepository;
  }
})();
