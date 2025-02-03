import type { Task } from '../models/Task';

export interface TaskRepository {
  getAllTasks(): Promise<Task[]>;
  getTasksByNotebook(notebookId: string): Promise<Task[]>;
  getTasksWithDueDate(date: Date): Promise<Task[]>;
}
