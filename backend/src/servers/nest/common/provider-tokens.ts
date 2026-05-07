/**
 * Runtime-токены для Nest DI.
 *
 * TypeScript-интерфейсы репозиториев исчезают после компиляции, поэтому Nest не
 * может использовать `TaskRepository` / `UserRepository` как токены напрямую.
 * Символы дают стабильные runtime-ключи и не привязывают сервисы к Nest.
 */
export const NEST_TASK_REPOSITORY = Symbol('NEST_TASK_REPOSITORY');
export const NEST_USER_REPOSITORY = Symbol('NEST_USER_REPOSITORY');
export const NEST_REFRESH_TOKEN_REPOSITORY = Symbol(
  'NEST_REFRESH_TOKEN_REPOSITORY',
);
export const NEST_GOOGLE_OAUTH_CLIENT = Symbol('NEST_GOOGLE_OAUTH_CLIENT');
