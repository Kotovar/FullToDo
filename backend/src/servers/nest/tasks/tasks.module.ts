import { Module } from '@nestjs/common';
import { SharedModule } from '../common/shared.module';
import { NotepadTasksController, TasksController } from './tasks.controller';

/**
 * Nest-модуль для функциональности задач (tasks).
 *
 * Объединяет два контроллера:
 * - {@link TasksController} — маршруты под `/tasks`,
 * - {@link NotepadTasksController} — маршруты под `/notepads/:notepadId/tasks`.
 *
 * Импортирует `SharedModule` для доступа к `TaskService` и другим
 * общим providers через явные границы модулей Nest.
 */
@Module({
  imports: [SharedModule],
  controllers: [TasksController, NotepadTasksController],
})
export class TasksModule {}
