import { TaskRepository } from '@repositories';
import type {
  CreateTask,
  PaginatedTasks,
  Task,
  TaskQueryParams,
  UpdateTask,
} from '@sharedCommon/schemas';

export class TaskService {
  constructor(private repository: TaskRepository) {}

  async createTask(
    task: CreateTask,
    notepadId: string,
    userId: number,
  ): Promise<Task> {
    return await this.repository.createTask(task, notepadId, userId);
  }

  async getAllTasks(
    userId: number,
    params?: TaskQueryParams,
  ): Promise<PaginatedTasks> {
    return await this.repository.getAllTasks(userId, params);
  }

  async getSingleTask(
    notepadId: string,
    taskId: string,
    userId: number,
  ): Promise<Task> {
    return await this.repository.getSingleTask(notepadId, taskId, userId);
  }

  async getSingleNotepadTasks(
    notepadId: string,
    userId: number,
    params?: TaskQueryParams,
  ): Promise<PaginatedTasks> {
    return await this.repository.getSingleNotepadTasks(
      notepadId,
      userId,
      params,
    );
  }

  async updateTask(
    taskId: string,
    task: UpdateTask,
    userId: number,
  ): Promise<Task> {
    return await this.repository.updateTask(taskId, task, userId);
  }

  async deleteTask(taskId: string, userId: number): Promise<void> {
    return await this.repository.deleteTask(taskId, userId);
  }
}
