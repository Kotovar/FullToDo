import {
  Response,
  CreateTask,
  UpdateTask,
  CreateNotepad,
} from '@shared/schemas';

export interface TaskRepository {
  createNotepad(notepad: CreateNotepad): Promise<Response>;
  createTask(task: CreateTask, notepadId: string): Promise<Response>;
  getAllNotepads(): Promise<Response>;
  getAllTasks(): Promise<Response>;
  getSingleTask(taskId: string, notepadId: string): Promise<Response>;
  getTasksByNotepad(notepadId: string): Promise<Response>;
  getTasksWithDueDate(date: Date): Promise<Response>;
  updateNotepad(notepadId: string, notepad: CreateNotepad): Promise<Response>;
  updateTask(
    taskId: string,
    notepadId: string,
    task: UpdateTask,
  ): Promise<Response>;
  deleteNotepad(notepadId: string): Promise<Response>;
  deleteTask(taskId: string): Promise<Response>;
}
