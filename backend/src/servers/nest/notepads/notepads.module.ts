import { Module } from '@nestjs/common';
import { SharedModule } from '../common/shared.module';
import { NotepadsController } from './notepads.controller';

/**
 * Nest-модуль для функциональности блокнотов.
 *
 * Импортирует `SharedModule`, чтобы получить доступ к `NotepadService`
 * и другим общим providers. Сервисы остаются framework-agnostic
 * (без `@Injectable()`), а DI-регистрация централизована в `SharedModule`.
 */
@Module({
  imports: [SharedModule],
  controllers: [NotepadsController],
})
export class NotepadsModule {}
