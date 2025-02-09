import { Task, NotepadWithoutTasks, Response } from '@shared/types';

export interface TaskRepository {
  getAllNotepads(): Promise<Response<NotepadWithoutTasks[]>>;
  getAllTasks(): Promise<Response<Task[]>>;
  getSingleTask(taskId: string): Promise<Response<Task>>;
  getTasksByNotepad(notebookId: string): Promise<Response<Task[]>>;
  getTasksWithDueDate(date: Date): Promise<Response<Task[]>>;
  createNotepad(title: string): Promise<Response<never>>;
  createTask(task: Task): Promise<Response<never>>;
  deleteTask(taskId: string): Promise<Response<never>>;
  updateTask(taskId: string, task: Task): Promise<Response<Task | null>>;
}
