export * from './interfaces';

import { config } from '@configs';
import { NOTEPADS, USERS } from '@db/mock';
import { MockTaskRepository, MockUserRepository } from './mock';
import { MockRefreshTokenRepository } from './mock/MockRefreshTokenRepository';
import { PostgresTaskRepository } from './postgres/PostgresTaskRepository';
import type {
  RefreshTokenRepository,
  TaskRepository,
  UserRepository,
} from './interfaces';

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

//TODO: Пока без реализации postgres
export const userRepository: UserRepository = (() => {
  switch (type) {
    case 'postgres':
      return new MockUserRepository(USERS);
    default:
      return new MockUserRepository(USERS);
  }
})();

export const refreshTokenRepository: RefreshTokenRepository = (() => {
  switch (type) {
    case 'postgres':
      return new MockRefreshTokenRepository();
    default:
      return new MockRefreshTokenRepository();
  }
})();
