import { repositoryLogger } from '@logger/repositories';
import { config } from '@configs';
import { NOTEPADS, USERS } from '@db/mock';
import {
  MockTaskRepository,
  MockUserRepository,
  MockRefreshTokenRepository,
} from './mock';
import {
  PostgresTaskRepository,
  PostgresRefreshTokenRepository,
  PostgresUserRepository,
} from './postgres';
import type {
  RefreshTokenRepository,
  TaskRepository,
  UserRepository,
} from './interfaces';
import {
  MongoRefreshTokenRepository,
  MongoTaskRepository,
  MongoUserRepository,
} from './mongo';

export * from './interfaces';

const {
  db: { type },
} = config;

export const taskRepository: TaskRepository = (() => {
  switch (type) {
    case 'mongo':
      return new MongoTaskRepository();
    case 'postgres':
      return new PostgresTaskRepository();
    default:
      return new MockTaskRepository(NOTEPADS);
  }
})();

export const userRepository: UserRepository = (() => {
  switch (type) {
    case 'mongo':
      return new MongoUserRepository();
    case 'postgres':
      return new PostgresUserRepository();
    default:
      return new MockUserRepository(USERS);
  }
})();

export const refreshTokenRepository: RefreshTokenRepository = (() => {
  switch (type) {
    case 'mongo':
      return new MongoRefreshTokenRepository();
    case 'postgres':
      return new PostgresRefreshTokenRepository();
    default:
      return new MockRefreshTokenRepository();
  }
})();

repositoryLogger.info(
  {
    taskRepository: taskRepository.constructor.name,
    userRepository: userRepository.constructor.name,
    refreshTokenRepository: refreshTokenRepository.constructor.name,
  },
  'repositories initialized',
);
