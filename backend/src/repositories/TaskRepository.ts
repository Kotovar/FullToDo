import {
  TaskResponse,
  TasksResponse,
  CreateTask,
  UpdateTask,
  CreateNotepad,
  NotepadResponse,
  NotepadWithoutTasksResponse,
} from '@shared/schemas';

export interface TaskRepository {
  createNotepad(notepad: CreateNotepad): Promise<NotepadResponse>;
  createTask(task: CreateTask, notepadId: string): Promise<TaskResponse>;
  getAllNotepads(): Promise<NotepadWithoutTasksResponse>;
  getAllTasks(): Promise<TasksResponse>;
  getSingleTask(taskId: string, notepadId?: string): Promise<TaskResponse>;
  getSingleNotepadTasks(notepadId: string): Promise<TasksResponse>;
  updateNotepad(
    notepadId: string,
    notepad: CreateNotepad,
  ): Promise<NotepadResponse>;
  updateTask(taskId: string, task: UpdateTask): Promise<TaskResponse>;
  deleteNotepad(notepadId: string): Promise<NotepadResponse>;
  deleteTask(taskId: string): Promise<TaskResponse>;
}
