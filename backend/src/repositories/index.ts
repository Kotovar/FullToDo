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
import {
  PrismaRefreshTokenRepository,
  PrismaTaskRepository,
  PrismaUserRepository,
} from './prisma';

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
    case 'prisma':
      return new PrismaTaskRepository();
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
    case 'prisma':
      return new PrismaUserRepository();
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
    case 'prisma':
      return new PrismaRefreshTokenRepository();
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
