import { Module } from '@nestjs/common';
import { nestProviders } from './providers';

/**
 * Модуль с общими providers (сервисы, репозитории, Google OAuth клиент).
 *
 * Экспортирует все providers, чтобы feature-модули могли импортировать
 * `SharedModule` и получать доступ к нужным зависимостям без `@Global()`.
 */
@Module({
  providers: nestProviders,
  exports: nestProviders,
})
export class SharedModule {}
