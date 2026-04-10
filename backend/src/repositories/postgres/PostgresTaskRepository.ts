import {
  COMMON_NOTEPAD_ID,
  USER_ID,
  PAGINATION,
  type Notepad,
  type NotepadWithoutTasks,
  type PaginatedTasks,
  type CreateNotepad,
  type CreateTask,
  type Task,
  type Subtask,
  type TaskQueryParams,
  type UpdateTask,
} from '@sharedCommon/schemas';
import type { TaskRepository } from '@repositories/interfaces/TaskRepository';
import {
  DB_ERRORS,
  isDbError,
  query,
  TASK_COLUMNS,
  buildTaskFilterSQL,
  buildOrderSQL,
  buildPaginationSQL,
  buildTaskUpdateSQL,
  buildSubtaskInsertSQL,
} from '@db/postgres';
import { ConflictError, ForbiddenError, NotFoundError } from '@errors/AppError';

export class PostgresTaskRepository implements TaskRepository {
  private async queryPaginatedTasks(
    whereSQL: string,
    values: unknown[],
    page: number,
    limit: number,
    orderSQL: string,
  ): Promise<PaginatedTasks> {
    const paginationSQL = buildPaginationSQL(page, limit);

    const [tasks, countResult] = await Promise.all([
      query<Task>(
        `SELECT ${TASK_COLUMNS} FROM tasks ${whereSQL} ${orderSQL} ${paginationSQL}`,
        values,
      ),
      query<{ count: string }>(
        `SELECT COUNT(*) FROM tasks ${whereSQL}`,
        values,
      ),
    ]);

    const total = Number(countResult.rows[0].count);
    return {
      tasks: tasks.rows,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createNotepad({ title }: CreateNotepad): Promise<Notepad> {
    try {
      const result = await query<{ _id: string; title: string }>(
        'INSERT INTO notepads (title) VALUES ($1) RETURNING _id::text, title',
        [title],
      );

      // TODO: заменить на реальные данные
      return { ...result.rows[0], tasks: [], userId: USER_ID };
    } catch (err) {
      if (isDbError(err) && err.code === DB_ERRORS.DUPLICATE) {
        throw new ConflictError(`Task with title ${title} already exists`);
      }

      throw err;
    }
  }

  async createTask(task: CreateTask, notepadId: string): Promise<Task> {
    const { title, dueDate } = task;

    const dbNotepadId = notepadId === COMMON_NOTEPAD_ID ? null : notepadId;

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

  async getAllNotepads(userId: number): Promise<NotepadWithoutTasks[]> {
    const notepads = await query<NotepadWithoutTasks>(
      'SELECT title, _id::text, user_id::text AS "userId" FROM notepads WHERE user_id = $1',
      [userId],
    );

    return [
      { title: 'Задачи', _id: COMMON_NOTEPAD_ID, userId },
      ...notepads.rows,
    ];
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

    return this.queryPaginatedTasks(whereSQL, values, page, limit, orderSQL);
  }

  async getSingleTask(notepadId: string, taskId: string): Promise<Task> {
    const isCommon = notepadId === COMMON_NOTEPAD_ID;

    const result = await query<Task>(
      `SELECT
        t._id::text,
        t.title,
        t.description,
        t.is_completed AS "isCompleted",
        t.created_date AS "createdDate",
        t.notepad_id::text AS "notepadId",
        t.due_date AS "dueDate",
        COALESCE(
          json_agg(
            json_build_object(
              '_id', s._id::text,
              'title', s.title,
              'isCompleted', s.is_completed
            )
          ) FILTER (WHERE s._id IS NOT NULL),
          '[]'
        ) AS subtasks
      FROM tasks t
      LEFT JOIN subtasks s ON s.task_id = t._id
      WHERE t._id = $1 ${isCommon ? '' : 'AND t.notepad_id = $2'}
      GROUP BY t._id`,
      isCommon ? [taskId] : [taskId, notepadId],
    );

    if (!result.rows[0]) {
      throw new NotFoundError(
        `Task ${taskId} not found in notepad ${notepadId}`,
      );
    }

    return result.rows[0];
  }

  async getSingleNotepadTasks(
    notepadId: string,
    params: TaskQueryParams = {},
  ): Promise<PaginatedTasks> {
    const isCommon = notepadId === COMMON_NOTEPAD_ID;

    const {
      sortBy,
      order,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = params;

    const { whereSQL, values } = buildTaskFilterSQL(
      params,
      [],
      isCommon ? undefined : notepadId,
    );
    const orderSQL = buildOrderSQL(sortBy, order);

    return this.queryPaginatedTasks(whereSQL, values, page, limit, orderSQL);
  }

  async updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<CreateNotepad>,
  ): Promise<Notepad> {
    const result = await query<Notepad>(
      `UPDATE notepads
        SET title = $1
        WHERE _id = $2
        RETURNING _id::text, title`,
      [updatedNotepadFields.title, notepadId],
    );

    if (!result.rows[0]) {
      throw new NotFoundError(`Notepad ${notepadId} not found`);
    }

    const tasks = await query<Task>(
      `SELECT ${TASK_COLUMNS} FROM tasks
        WHERE notepad_id = $1`,
      [notepadId],
    );

    return { ...result.rows[0], tasks: tasks.rows };
  }

  async updateTask(taskId: string, fields: Partial<UpdateTask>): Promise<Task> {
    const { subtasks, ...taskFields } = fields;

    let task: Task;

    if (Object.keys(taskFields).length > 0) {
      const { setSQL, values } = buildTaskUpdateSQL(taskFields);
      values.push(taskId);
      const result = await query<Task>(
        `UPDATE tasks SET ${setSQL} WHERE _id = $${values.length} RETURNING ${TASK_COLUMNS}`,
        values,
      );
      if (!result.rows[0]) throw new NotFoundError(`Task ${taskId} not found`);
      task = result.rows[0];
    } else {
      const result = await query<Task>(
        `SELECT ${TASK_COLUMNS} FROM tasks WHERE _id = $1`,
        [taskId],
      );
      if (!result.rows[0]) throw new NotFoundError(`Task ${taskId} not found`);
      task = result.rows[0];
    }

    if (subtasks !== undefined) {
      await query(`DELETE FROM subtasks WHERE task_id = $1`, [taskId]);
      if (subtasks.length > 0) {
        const { insertSQL, values: subtaskValues } = buildSubtaskInsertSQL(
          subtasks,
          taskId,
        );
        const subtaskResult = await query<Subtask>(insertSQL, subtaskValues);
        return { ...task, subtasks: subtaskResult.rows };
      }
      return { ...task, subtasks: [] };
    }

    return { ...task, subtasks: subtasks ?? [] };
  }

  async deleteNotepad(notepadId: string): Promise<void> {
    if (notepadId === COMMON_NOTEPAD_ID) {
      throw new ForbiddenError(`Cannot delete the common notepad`);
    }

    const result = await query(`DELETE FROM notepads WHERE _id = $1`, [
      notepadId,
    ]);

    if (result.rowCount === 0)
      throw new NotFoundError(`Notepad ${notepadId} not found`);
  }

  async deleteTask(taskId: string): Promise<void> {
    const result = await query(`DELETE FROM tasks WHERE _id = $1`, [taskId]);

    if (result.rowCount === 0)
      throw new NotFoundError(`Task with id ${taskId} not found`);
  }
}
