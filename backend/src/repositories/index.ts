export * from './interfaces';

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

export const userRepository: UserRepository = (() => {
  switch (type) {
    case 'postgres':
      return new PostgresUserRepository();
    default:
      return new MockUserRepository(USERS);
  }
})();

export const refreshTokenRepository: RefreshTokenRepository = (() => {
  switch (type) {
    case 'postgres':
      return new PostgresRefreshTokenRepository();
    default:
      return new MockRefreshTokenRepository();
  }
})();
