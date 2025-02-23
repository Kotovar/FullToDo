import {
  Task,
  NotepadWithoutTasks,
  Response,
  Notepad,
  CreateTask,
  UpdateTask,
  CreateNotepad,
} from '@shared/schemas';

export interface TaskRepository {
  createNotepad(notepad: CreateNotepad): Promise<Response<never>>;
  createTask(task: CreateTask, notepadId: string): Promise<Response<never>>;
  getAllNotepads(): Promise<Response<NotepadWithoutTasks[]>>;
  getAllTasks(): Promise<Response<Task[]>>;
  getSingleTask(taskId: string, notepadId: string): Promise<Response<Task>>;
  getTasksByNotepad(notepadId: string): Promise<Response<Task[]>>;
  getTasksWithDueDate(date: Date): Promise<Response<Task[]>>;
  updateNotepad(
    notepadId: string,
    notepad: CreateNotepad,
  ): Promise<Response<Notepad | null>>;
  updateTask(
    taskId: string,
    notepadId: string,
    task: UpdateTask,
  ): Promise<Response<Task | null>>;
  deleteNotepad(notepadId: string): Promise<Response<never>>;
  deleteTask(taskId: string): Promise<Response<never>>;
}
