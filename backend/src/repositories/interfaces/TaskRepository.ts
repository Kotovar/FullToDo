import type {
  CreateTask,
  UpdateTask,
  CreateNotepad,
  NotepadWithoutTasks,
  TaskQueryParams,
  Task,
  Notepad,
  PaginatedTasks,
} from '@sharedCommon/schemas';

export interface TaskRepository {
  createNotepad(notepad: CreateNotepad): Promise<Notepad>;
  createTask(task: CreateTask, notepadId: string): Promise<Task>;
  getAllNotepads(userId: number): Promise<NotepadWithoutTasks[]>;
  getAllTasks(params?: TaskQueryParams): Promise<PaginatedTasks>;
  getSingleTask(taskId: string, notepadId?: string): Promise<Task>;
  getSingleNotepadTasks(
    taskId: string,
    params?: TaskQueryParams,
  ): Promise<PaginatedTasks>;
  updateNotepad(
    notepadId: string,
    notepad: Partial<CreateNotepad>,
  ): Promise<Notepad>;
  updateTask(taskId: string, task: UpdateTask): Promise<Task>;
  deleteNotepad(notepadId: string): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
}
