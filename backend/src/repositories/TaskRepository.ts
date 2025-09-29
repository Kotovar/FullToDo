import type {
  TaskResponse,
  TasksResponse,
  CreateTask,
  UpdateTask,
  CreateNotepad,
  NotepadResponse,
  NotepadWithoutTasksResponse,
  TaskQueryParams,
  TaskResponseSingle,
} from '@sharedCommon/schemas';

export interface TaskRepository {
  createNotepad(notepad: CreateNotepad): Promise<NotepadResponse>;
  createTask(task: CreateTask, notepadId: string): Promise<TaskResponseSingle>;
  getAllNotepads(): Promise<NotepadWithoutTasksResponse>;
  getAllTasks(params?: TaskQueryParams): Promise<TasksResponse>;
  getSingleTask(taskId: string, notepadId?: string): Promise<TaskResponse>;
  getSingleNotepadTasks(
    notepadId: string,
    params?: TaskQueryParams,
  ): Promise<TasksResponse>;
  updateNotepad(
    notepadId: string,
    notepad: CreateNotepad,
  ): Promise<NotepadResponse>;
  updateTask(taskId: string, task: UpdateTask): Promise<TaskResponseSingle>;
  deleteNotepad(notepadId: string): Promise<NotepadResponse>;
  deleteTask(taskId: string): Promise<TaskResponseSingle>;
}
