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

  async createTask(task: CreateTask, notepadId: string): Promise<Task> {
    return await this.repository.createTask(task, notepadId);
  }

  async getAllTasks(params?: TaskQueryParams): Promise<PaginatedTasks> {
    return await this.repository.getAllTasks(params);
  }

  async getSingleTask(notepadId: string, taskId: string): Promise<Task> {
    return await this.repository.getSingleTask(notepadId, taskId);
  }

  async getSingleNotepadTasks(
    notepadId: string,
    params?: TaskQueryParams,
  ): Promise<PaginatedTasks> {
    return await this.repository.getSingleNotepadTasks(notepadId, params);
  }

  async updateTask(taskId: string, task: UpdateTask): Promise<Task> {
    return await this.repository.updateTask(taskId, task);
  }

  async deleteTask(taskId: string): Promise<void> {
    return await this.repository.deleteTask(taskId);
  }
}
