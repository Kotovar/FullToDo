import { Task, Notepad, NotepadNameAndId, Response } from '@shared/types';

// import { NotepadNameAndId } from "shared/types";

export interface TaskRepository {
  getAllNotepads(): Promise<Response<NotepadNameAndId[]>>;
  getAllTasks(): Promise<Response<Task[]>>;
  getTasksByNotepad(notebookId: string): Promise<Response<Task[]>>;
  getTasksWithDueDate(date: Date): Promise<Response<Task[]>>;
  createNotepad(title: string): Promise<Response<Notepad[]>>;
}
