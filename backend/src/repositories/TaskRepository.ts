import { Task, NotepadWithoutTasks, Response, Notepad } from '@shared/types';

export interface TaskRepository {
  getAllNotepads(): Promise<Response<NotepadWithoutTasks[]>>;
  getAllTasks(): Promise<Response<Task[]>>;
  getSingleTask(taskId: string, notepadId: string): Promise<Response<Task>>;
  getTasksByNotepad(notepadId: string): Promise<Response<Task[]>>;
  getTasksWithDueDate(date: Date): Promise<Response<Task[]>>;
  createNotepad(title: string): Promise<Response<never>>;
  createTask(task: Task, notepadId: string): Promise<Response<never>>;
  deleteTask(taskId: string): Promise<Response<never>>;
  deleteNotepad(notepadId: string): Promise<Response<never>>;
  updateTask(
    taskId: string,
    notepadId: string,
    task: Task,
  ): Promise<Response<Task | null>>;
  updateNotepad(
    notepadId: string,
    notepad: Notepad,
  ): Promise<Response<Notepad | null>>;
}
