import { Module } from '@nestjs/common';
import { NotepadsController } from './notepads.controller';

/**
 * Nest-модуль для функциональности блокнотов.
 *
 * Модуль объединяет в себе контроллеры, относящиеся к блокнотам.
 * Сервис `NotepadService` здесь не регистрируется заново — он доступен
 * из глобального `AppModule` (через декоратор `@Global()` на нем),
 * поэтому контроллер может инжектировать его через конструктор.
 *
 * Такой подход позволяет:
 * - не дублировать DI-регистрацию сервисов,
 * - сохранить сервисы framework-agnostic (без `@Injectable()`),
 * - постепенно наращивать Nest-модули, не переделывая корневой DI.
 */
@Module({
  controllers: [NotepadsController],
})
export class NotepadsModule {}
