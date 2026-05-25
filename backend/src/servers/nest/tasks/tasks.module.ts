import { Module } from '@nestjs/common';
import { NotepadTasksController, TasksController } from './tasks.controller';

/**
 * Nest-модуль для функциональности задач (tasks).
 *
 * Объединяет два контроллера:
 * - {@link TasksController} — маршруты под `/tasks`,
 * - {@link NotepadTasksController} — маршруты под `/notepads/:notepadId/tasks`.
 *
 * `TaskService` не регистрируется заново — он доступен из глобального
 * `AppModule` (через декоратор `@Global()`), поэтому контроллеры могут
 * инжектировать его через конструктор.
 */
@Module({
  controllers: [TasksController, NotepadTasksController],
})
export class TasksModule {}
