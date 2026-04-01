import {
  commonNotepadId,
  Notepad,
  NotepadWithoutTasks,
  PaginatedTasks,
  type CreateNotepad,
  type CreateTask,
  type Task,
  type TaskQueryParams,
} from '@sharedCommon/schemas';
import type { TaskRepository } from './TaskRepository';
import { DB_ERRORS, isDbError, query } from '@db/postgres';
import { ConflictError, NotFoundError } from '../errors';

export class PostgresTaskRepository implements TaskRepository {
  async createNotepad({ title }: CreateNotepad): Promise<Notepad> {
    try {
      const result = await query<Notepad>(
        'INSERT INTO notepads (title) VALUES ($1)',
        [title],
      );
      return result.rows[0];
    } catch (err) {
      if (isDbError(err) && err.code === DB_ERRORS.DUPLICATE) {
        if (err.code === DB_ERRORS.DUPLICATE) {
          throw new ConflictError(`Task with title ${title} already exists`);
        }
      }

      throw err;
    }
  }

  async createTask(task: CreateTask, notepadId: string): Promise<Task> {
    const { title, dueDate } = task;

    const dbNotepadId = notepadId === commonNotepadId ? null : notepadId;

    try {
      const result = await query<Task>(
        'INSERT INTO tasks (notepad_id, title, due_date) VALUES ($1, $2, $3)',
        [dbNotepadId, title, dueDate],
      );
      return result.rows[0];
    } catch (err) {
      if (isDbError(err)) {
        if (err.code === DB_ERRORS.FOREIGN_KEY) {
          throw new NotFoundError(`Notebook ${notepadId} not found`);
        }
        if (err.code === DB_ERRORS.DUPLICATE) {
          throw new ConflictError(`Task with title ${title} already exists`);
        }
      }
      throw err;
    }
  }

  async getAllNotepads(): Promise<NotepadWithoutTasks[]> {
    //TODO: поменять, берём только title и id
    const notepads = await query<{ title: string; _id: string }>(
      'SELECT * FROM notepads',
    );

    return [{ title: 'Задачи', _id: commonNotepadId }, ...notepads.rows];
  }

  getAllTasks(params?: TaskQueryParams): Promise<PaginatedTasks> {
    throw new Error('Method not implemented.' + params);
  }
  getSingleTask(notepadId: string, taskId: string): Promise<Task> {
    throw new Error('Method not implemented.' + notepadId + ' ' + taskId);
  }
  getSingleNotepadTasks(
    notepadId: string,
    params?: TaskQueryParams,
  ): Promise<PaginatedTasks> {
    throw new Error('Method not implemented.' + notepadId + ' ' + params);
  }

  updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<CreateNotepad>,
  ): Promise<Notepad> {
    throw new Error(
      'Method not implemented.' + ' ' + notepadId + ' ' + updatedNotepadFields,
    );
  }
  updateTask(taskId: string, updatedTaskFields: Partial<Task>): Promise<Task> {
    throw new Error(
      'Method not implemented.' + ' ' + taskId + ' ' + updatedTaskFields,
    );
  }
  deleteNotepad(notepadId: string): Promise<void> {
    throw new Error('Method not implemented.' + ' ' + notepadId);
  }
  deleteTask(taskId: string): Promise<void> {
    throw new Error('Method not implemented.' + ' ' + taskId);
  }
}
