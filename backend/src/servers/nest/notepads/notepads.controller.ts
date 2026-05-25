import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NotepadService } from '@services';
import { createNotepadSchema } from '@sharedCommon/schemas';
import { ROUTES } from '@sharedCommon/routes';
import { AuthGuard } from '../common/auth.guard';
import { UserId } from '../common/user-id.decorator';
import { ZodValidationPipe } from '../common/zod-validation.pipe';

/**
 * Nest-контроллер для управления блокнотами (notepads).
 *
 * Контроллер отвечает только за:
 * - маршрутизацию (какой HTTP-метод и путь),
 * - аутентификацию (через {@link AuthGuard}),
 * - валидацию входных данных (через {@link ZodValidationPipe}),
 * - извлечение `userId` (через {@link UserId}),
 * - вызов сервиса и формирование ответа.
 *
 * Вся бизнес-логика остается внутри {@link NotepadService}, который остается
 * независимым от Nest (framework-agnostic).
 *
 * `@Controller(ROUTES.notepads.base)` устанавливает базовый префикс `/notepads`
 * для всех методов класса.
 */
@Controller(ROUTES.notepads.base)
@UseGuards(AuthGuard)
export class NotepadsController {
  constructor(private readonly notepadService: NotepadService) {}

  /**
   * `@Body(new ZodValidationPipe(createNotepadSchema))` — это pipe,
   * которая автоматически пропускает `req.body` через Zod-схему. Если данные
   * невалидны, pipe выбросит {@link ZodValidationError}, который глобальный
   * {@link AppErrorFilter} превратит в JSON-ответ `400 { message, errors }`.
   *
   * `@UserId()` извлекает `userId` из запроса, куда его положил `AuthGuard`.
   */
  @Post()
  async create(
    @Body(new ZodValidationPipe(createNotepadSchema))
    data: { title: string },
    @UserId() userId: number,
  ) {
    const notepad = await this.notepadService.createNotepad(data, userId);
    return {
      message: `Notepad "${notepad.title}" created`,
      notepad,
    };
  }

  @Get()
  async findAll(@UserId() userId: number) {
    const data = await this.notepadService.getAllNotepads(userId);
    return {
      message: 'Success',
      data,
    };
  }

  /**
   * Обновляет заголовок блокнота по ID
   *
   * `@Patch(':notepadId')` означает `PATCH /notepads/:notepadId`.
   *
   * `@Param('notepadId')` автоматически извлекает значение параметра из URL.
   */
  @Patch(':notepadId')
  async update(
    @Param('notepadId') notepadId: string,
    @Body(new ZodValidationPipe(createNotepadSchema))
    data: { title: string },
    @UserId() userId: number,
  ) {
    const updatedNotepad = await this.notepadService.updateNotepad(
      notepadId,
      data,
      userId,
    );
    return {
      message: `A notepad with the id ${notepadId} has been successfully updated`,
      data: updatedNotepad,
    };
  }

  /**
   * Удаляет блокнот по ID.
   *
   * `@Delete(':notepadId')` означает `DELETE /notepads/:notepadId`.
   */
  @Delete(':notepadId')
  async remove(
    @Param('notepadId') notepadId: string,
    @UserId() userId: number,
  ) {
    await this.notepadService.deleteNotepad(notepadId, userId);
    return {
      message: 'Notepad deleted successfully',
    };
  }
}
