import type { Task } from '../models/Task';
import { TaskRepository } from './TaskRepository';

export class MockTaskRepository implements TaskRepository {
  private tasks: Task[];

  constructor(tasks: Task[]) {
    this.tasks = tasks;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async getTasksByNotebook(notebookId: string): Promise<Task[]> {
    return this.tasks.filter(task => task.notebookId === notebookId);
  }

  async getTasksWithDueDate(date: Date): Promise<Task[]> {
    return this.tasks.filter(
      task => task.dueDate?.toDateString() === date.toDateString(),
    );
  }
}
