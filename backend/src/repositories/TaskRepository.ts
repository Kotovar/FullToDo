import type { Task } from '../models/Task';

export interface Response<T> {
  status: 200 | 404 | 500;
  message: string;
  data: T;
}

export interface TaskRepository {
  getAllTasks(): Promise<Response<Task[]>>;
  getTasksByNotepad(notebookId: string): Promise<Response<Task[]>>;
  getTasksWithDueDate(date: Date): Promise<Response<Task[]>>;
}
