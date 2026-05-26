import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from '@services';
import {
  COMMON_NOTEPAD_ID,
  createTaskSchema,
  updateTaskSchema,
  taskQueryParamsSchema,
} from '@sharedCommon/schemas';
import type {
  CreateTask,
  UpdateTask,
  TaskQueryParams,
} from '@sharedCommon/schemas';
import { ROUTES } from '@sharedCommon/routes';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/auth.guard';
import { UserId } from '../common/user-id.decorator';
import { ZodValidationPipe } from '../common/zod-validation.pipe';

/**
 * Nest-контроллер для задач под префиксом `/tasks`.
 *
 * Задачи здесь всегда принадлежат common notepad (`COMMON_NOTEPAD_ID`).
 */
@ApiTags('Tasks')
@ApiBearerAuth()
@Controller(ROUTES.tasks.base)
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createTaskSchema))
    data: CreateTask,
    @UserId() userId: number,
  ) {
    const task = await this.taskService.createTask(
      data,
      COMMON_NOTEPAD_ID,
      userId,
    );
    return {
      message: `Task "${task.title}" created`,
      task,
    };
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(taskQueryParamsSchema))
    params: TaskQueryParams,
    @UserId() userId: number,
  ) {
    const { tasks, meta } = await this.taskService.getAllTasks(userId, params);
    return {
      message: 'Success',
      data: tasks,
      meta,
    };
  }

  @Get(':taskId')
  async findOne(@Param('taskId') taskId: string, @UserId() userId: number) {
    const task = await this.taskService.getSingleTask(
      COMMON_NOTEPAD_ID,
      taskId,
      userId,
    );
    return {
      message: 'Success',
      data: task,
    };
  }

  @Patch(':taskId')
  async update(
    @Param('taskId') taskId: string,
    @Body(new ZodValidationPipe(updateTaskSchema))
    data: UpdateTask,
    @UserId() userId: number,
  ) {
    const updatedTask = await this.taskService.updateTask(taskId, data, userId);
    return {
      message: `A task with the _id ${taskId} has been successfully updated`,
      data: updatedTask,
    };
  }

  @Delete(':taskId')
  async remove(@Param('taskId') taskId: string, @UserId() userId: number) {
    await this.taskService.deleteTask(taskId, userId);
    return {
      message: 'Task deleted successfully',
    };
  }
}

/**
 * Nest-контроллер для задач внутри конкретного блокнота (`/notepads/:notepadId/tasks`).
 *
 * Регистрируется отдельным классом, потому что базовый путь отличается
 * от `/tasks`. Nest позволяет иметь несколько контроллеров с одним
 * базовым префиксом (здесь `/notepads`), поэтому коллизий
 * с {@link NotepadsController} не возникает.
 */
@ApiTags('Notepad Tasks')
@ApiBearerAuth()
@Controller(ROUTES.notepads.base)
@UseGuards(AuthGuard)
export class NotepadTasksController {
  constructor(private readonly taskService: TaskService) {}

  @Post(':notepadId/tasks')
  async create(
    @Param('notepadId') notepadId: string,
    @Body(new ZodValidationPipe(createTaskSchema))
    data: CreateTask,
    @UserId() userId: number,
  ) {
    const task = await this.taskService.createTask(data, notepadId, userId);
    return {
      message: `Task "${task.title}" created`,
      task,
    };
  }

  @Get(':notepadId/tasks')
  async findAll(
    @Param('notepadId') notepadId: string,
    @Query(new ZodValidationPipe(taskQueryParamsSchema))
    params: TaskQueryParams,
    @UserId() userId: number,
  ) {
    const { tasks, meta } = await this.taskService.getSingleNotepadTasks(
      notepadId,
      userId,
      params,
    );
    return {
      message: 'Success',
      data: tasks,
      meta,
    };
  }

  @Get(':notepadId/tasks/:taskId')
  async findOne(
    @Param('notepadId') notepadId: string,
    @Param('taskId') taskId: string,
    @UserId() userId: number,
  ) {
    const task = await this.taskService.getSingleTask(
      notepadId,
      taskId,
      userId,
    );
    return {
      message: 'Success',
      data: task,
    };
  }

  @Patch(':notepadId/tasks/:taskId')
  async update(
    @Param('notepadId') _notepadId: string,
    @Param('taskId') taskId: string,
    @Body(new ZodValidationPipe(updateTaskSchema))
    data: UpdateTask,
    @UserId() userId: number,
  ) {
    const updatedTask = await this.taskService.updateTask(taskId, data, userId);
    return {
      message: `A task with the _id ${taskId} has been successfully updated`,
      data: updatedTask,
    };
  }

  @Delete(':notepadId/tasks/:taskId')
  async remove(
    @Param('notepadId') _notepadId: string,
    @Param('taskId') taskId: string,
    @UserId() userId: number,
  ) {
    await this.taskService.deleteTask(taskId, userId);
    return {
      message: 'Task deleted successfully',
    };
  }
}
