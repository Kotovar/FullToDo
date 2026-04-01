import {
  commonNotepadId,
  PAGINATION,
  type Notepad,
  type NotepadWithoutTasks,
  type PaginatedTasks,
  type CreateNotepad,
  type CreateTask,
  type Task,
  type TaskQueryParams,
} from '@sharedCommon/schemas';
import type { TaskRepository } from './TaskRepository';
import {
  DB_ERRORS,
  isDbError,
  query,
  TASK_COLUMNS,
  buildTaskFilterSQL,
  buildOrderSQL,
  buildPaginationSQL,
} from '@db/postgres';
import { ConflictError, NotFoundError } from '../errors';

export class PostgresTaskRepository implements TaskRepository {
  async createNotepad({ title }: CreateNotepad): Promise<Notepad> {
    try {
      const result = await query<{ _id: string; title: string }>(
        'INSERT INTO notepads (title) VALUES ($1) RETURNING _id::text, title',
        [title],
      );
      return { ...result.rows[0], tasks: [] };
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
        `INSERT INTO tasks (notepad_id, title, due_date) VALUES ($1, $2, $3)
         RETURNING _id::text, title, description, due_date AS "dueDate",
                   created_date AS "createdDate", is_completed AS "isCompleted",
                   COALESCE(notepad_id::text, $4) AS "notepadId"`,
        [dbNotepadId, title, dueDate, notepadId],
      );
      return { ...result.rows[0], subtasks: [], progress: '' };
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
    const notepads = await query<NotepadWithoutTasks>(
      'SELECT title, _id FROM notepads',
    );

    return [{ title: 'Задачи', _id: commonNotepadId }, ...notepads.rows];
  }

  async getAllTasks(params: TaskQueryParams = {}): Promise<PaginatedTasks> {
    const {
      sortBy,
      order,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = params;

    const { whereSQL, values } = buildTaskFilterSQL(params);
    const orderSQL = buildOrderSQL(sortBy, order);
    const paginationSQL = buildPaginationSQL(page, limit);

    const tasks = await query<Task>(
      `SELECT ${TASK_COLUMNS} FROM tasks ${whereSQL} ${orderSQL} ${paginationSQL}`,
      values,
    );

    /**
     * Отдельный запрос для подсчёта общего числа записей без LIMIT.
     * Нужен для корректного totalPages в мета-данных пагинации.
     */
    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM tasks ${whereSQL}`,
      values,
    );
    const total = Number(countResult.rows[0].count);

    return {
      tasks: tasks.rows,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
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
