import { Module } from '@nestjs/common';
import { SharedModule } from './common/shared.module';
import { AuthModule } from './auth/auth.module';
import { NotepadsModule } from './notepads/notepads.module';
import { TasksModule } from './tasks/tasks.module';

/**
 * Корневой модуль Nest-приложения.
 *
 * Импортирует `SharedModule` (общие сервисы и репозитории) и все
 * feature-модули. Дочерние модули сами импортируют `SharedModule`,
 * чтобы получить доступ к нужным providers, — такие границы модулей
 * явны и не требуют `@Global()`.
 */
@Module({
  imports: [SharedModule, AuthModule, NotepadsModule, TasksModule],
})
export class AppModule {}
