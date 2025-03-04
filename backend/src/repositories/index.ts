import { config } from 'dotenv';
import MockTaskRepository from './MockTaskRepository';

config();

export const getDbType = () => process.env.DB_TYPE || 'mock';

const DB_TYPE = getDbType();

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
