import { Global, Module } from '@nestjs/common';
import { nestProviders } from './common/providers';
import { NotepadsModule } from './notepads/notepads.module';
import { TasksModule } from './tasks/tasks.module';

/**
 * Корневой модуль Nest-приложения.
 *
 * `@Global()` делает все providers этого модуля доступными в любом другом
 * модуле без явного импорта. Это упрощает миграцию, потому что сервисы
 * регистрируются централизованно (в `nestProviders`), а дочерние модули
 * (NotepadsModule, TasksModule, AuthModule) просто используют их.
 *
 * Когда вся миграция завершится, можно убрать `@Global()` и явно
 * импортировать общие модули в каждый дочерний модуль.
 */
@Global()
@Module({
  imports: [NotepadsModule, TasksModule],
  providers: nestProviders,
  exports: nestProviders,
})
export class AppModule {}
