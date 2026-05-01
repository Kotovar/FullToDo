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
  createNotepad(notepad: CreateNotepad, userId: number): Promise<Notepad>;
  createTask(
    task: CreateTask,
    notepadId: string,
    userId: number,
  ): Promise<Task>;
  getAllNotepads(userId: number): Promise<NotepadWithoutTasks[]>;
  getAllTasks(
    userId: number,
    params?: TaskQueryParams,
  ): Promise<PaginatedTasks>;
  getSingleTask(
    notepadId: string,
    taskId: string,
    userId: number,
  ): Promise<Task>;
  getSingleNotepadTasks(
    notepadId: string,
    userId: number,
    params?: TaskQueryParams,
  ): Promise<PaginatedTasks>;
  updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<CreateNotepad>,
    userId: number,
  ): Promise<Notepad>;
  updateTask(taskId: string, task: UpdateTask, userId: number): Promise<Task>;
  deleteNotepad(notepadId: string, userId: number): Promise<void>;
  deleteTask(taskId: string, userId: number): Promise<void>;
}
