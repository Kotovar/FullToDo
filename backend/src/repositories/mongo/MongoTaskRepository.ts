import type { Filter, Sort } from 'mongodb';
import {
  connectMongo,
  isMongoDbError,
  withMongoTransaction,
  MONGO_COLLECTIONS,
  MONGO_DB_ERRORS,
} from '@db/mongo';
import { ConflictError, ForbiddenError, NotFoundError } from '@errors/AppError';
import {
  COMMON_NOTEPAD_ID,
  PAGINATION,
  type PaginationMeta,
  type CreateNotepad,
  type CreateTask,
  type Notepad,
  type NotepadWithoutTasks,
  type PaginatedTasks,
  type Task,
  type TaskQueryParams,
  type UpdateTask,
} from '@sharedCommon/schemas';
import type { TaskRepository } from '@repositories/interfaces';

type PaginatedMongoTasks = {
  tasks: Task[];
  meta: PaginationMeta;
};

export class MongoTaskRepository implements TaskRepository {
  /**
   * Генерирует строковый идентификатор для документов MongoDB.
   *
   * В приложении `_id` у задач и блокнотов должен быть строкой: это зафиксировано
   * в shared Zod-схемах и совпадает с поведением mock/PostgreSQL репозиториев.
   * Если не задать `_id` вручную, MongoDB создаст ObjectId, который не совпадает
   * с API-контрактом проекта.
   */
  private generateId(): string {
    return globalThis.crypto.randomUUID();
  }

  /**
   * Экранирует пользовательскую строку перед использованием в RegExp.
   *
   * Поиск по задачам должен работать как обычный текстовый поиск, а не как
   * выполнение регулярного выражения, введённого пользователем. Поэтому символы
   * со специальным смыслом в RegExp (`.`, `*`, `?`, `(`, `)`, `[`, `]` и т.д.)
   * превращаются в литералы: например `task.*` становится `task\.\*`.
   */
  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Рассчитывает строковый прогресс задачи по массиву подзадач.
   *
   * Формат совпадает с mock/PostgreSQL репозиториями: если подзадач нет,
   * возвращается пустая строка; если подзадачи есть, возвращается значение
   * вида `completed/total`, например `2/5`.
   */
  private calculateProgress(subtasks?: Task['subtasks']): string {
    if (!subtasks?.length) return '';

    const completed = subtasks.filter(subtask => subtask.isCompleted).length;
    return `${completed}/${subtasks.length}`;
  }

  /**
   * Собирает MongoDB-фильтр для выборки задач.
   *
   * `userId` всегда добавляется в фильтр первым, чтобы репозиторий возвращал
   * только ресурсы текущего пользователя.
   */
  private buildTaskFilter(
    userId: number,
    params: TaskQueryParams,
    notepadId?: string,
  ): Filter<Task> {
    const filter: Filter<Task> = { userId };

    if (notepadId) {
      filter.notepadId = notepadId;
    }

    if (params.isCompleted !== undefined) {
      filter.isCompleted = params.isCompleted === 'true';
    }

    if (params.hasDueDate !== undefined) {
      filter.dueDate =
        params.hasDueDate === 'true'
          ? { $exists: true, $ne: null }
          : { $exists: false };
    }

    if (params.search?.trim()) {
      const searchRegex = new RegExp(
        this.escapeRegex(params.search.trim()),
        'i',
      );
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    return filter;
  }

  /**
   * Собирает объект сортировки для MongoDB cursor-а.
   *
   * Поля сортировки приходят из Zod-валидированной схемы `TaskQueryParams`,
   * поэтому допустимы только значения, поддержанные API (`createdDate`,
   * `dueDate`). Если поле не передано, используется сортировка по дате создания.
   *
   * MongoDB ожидает направление сортировки как `1` для ASC и `-1` для DESC.
   */
  private buildTaskSort(
    sortBy: TaskQueryParams['sortBy'],
    order: TaskQueryParams['order'],
  ): Sort {
    const field = sortBy ?? 'createdDate';
    return { [field]: order === 'asc' ? 1 : -1 };
  }

  /**
   * Выполняет пагинированную выборку задач и считает общее количество документов.
   *
   * Метод принимает уже собранные `filter` и `sort`, применяет `skip/limit`
   * для текущей страницы и параллельно запускает `countDocuments` с тем же
   * фильтром. Count нужен для `meta.total` и `meta.totalPages`, а параллельное
   * выполнение через `Promise.all` убирает лишнее последовательное ожидание,
   * потому что выборка страницы и подсчёт общего количества независимы.
   */
  private async getPaginatedTasks(
    filter: Filter<Task>,
    sort: Sort,
    page: number,
    limit: number,
  ): Promise<PaginatedMongoTasks> {
    const db = await connectMongo();
    const tasksCollection = db.collection<Task>(MONGO_COLLECTIONS.tasks);

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      tasksCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
      tasksCollection.countDocuments(filter),
    ]);

    return {
      tasks,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createNotepad(
    { title }: CreateNotepad,
    userId: number,
  ): Promise<Notepad> {
    const db = await connectMongo();
    const notepads = db.collection<NotepadWithoutTasks>(
      MONGO_COLLECTIONS.notepads,
    );

    const newNotepad: NotepadWithoutTasks = {
      _id: this.generateId(),
      title,
      userId,
    };

    try {
      await notepads.insertOne(newNotepad);

      return { ...newNotepad, tasks: [] };
    } catch (err) {
      if (isMongoDbError(err) && err.code === MONGO_DB_ERRORS.DUPLICATE) {
        throw new ConflictError(`Notepad with title ${title} already exists`);
      }

      throw err;
    }
  }

  async createTask(
    task: CreateTask,
    notepadId: string,
    userId: number,
  ): Promise<Task> {
    const db = await connectMongo();
    const notepads = db.collection<NotepadWithoutTasks>(
      MONGO_COLLECTIONS.notepads,
    );
    const tasks = db.collection<Task>(MONGO_COLLECTIONS.tasks);

    const { title, dueDate, description } = task;
    const isCommonNotepad = notepadId === COMMON_NOTEPAD_ID;

    if (!isCommonNotepad) {
      const notepad = await notepads.findOne({ _id: notepadId, userId });

      if (!notepad) {
        throw new NotFoundError(`Notebook ${notepadId} not found`);
      }
    }

    const newTask: Task = {
      _id: this.generateId(),
      title,
      createdDate: new Date(),
      isCompleted: false,
      subtasks: [],
      progress: '',
      notepadId,
      userId,
      ...(description !== undefined && { description }),
      ...(dueDate != null && { dueDate }),
    };

    await tasks.insertOne(newTask);
    return newTask;
  }

  async getAllNotepads(userId: number): Promise<NotepadWithoutTasks[]> {
    const db = await connectMongo();

    const notepads = db.collection<NotepadWithoutTasks>(
      MONGO_COLLECTIONS.notepads,
    );

    const result = await notepads.find({ userId }).toArray();

    return [{ title: 'Задачи', _id: COMMON_NOTEPAD_ID, userId }, ...result];
  }

  async getAllTasks(
    userId: number,
    params: TaskQueryParams = {},
  ): Promise<PaginatedTasks> {
    const {
      sortBy,
      order,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = params;

    const filter = this.buildTaskFilter(userId, params);
    const sort = this.buildTaskSort(sortBy, order);

    return this.getPaginatedTasks(filter, sort, page, limit);
  }

  async getSingleTask(
    notepadId: string,
    taskId: string,
    userId: number,
  ): Promise<Task> {
    const db = await connectMongo();
    const tasks = db.collection<Task>(MONGO_COLLECTIONS.tasks);

    const isCommonNotepad = notepadId === COMMON_NOTEPAD_ID;
    const filter: Filter<Task> = {
      _id: taskId,
      userId,
    };

    if (!isCommonNotepad) {
      filter.notepadId = notepadId;
    }

    const task = await tasks.findOne(filter);

    if (!task) {
      throw new NotFoundError(
        `Task ${taskId} not found in notepad ${notepadId}`,
      );
    }

    return task;
  }

  async getSingleNotepadTasks(
    notepadId: string,
    userId: number,
    params: TaskQueryParams = {},
  ): Promise<PaginatedTasks> {
    const {
      sortBy,
      order,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = params;
    const isCommonNotepad = notepadId === COMMON_NOTEPAD_ID;

    if (!isCommonNotepad) {
      const db = await connectMongo();
      const notepads = db.collection<NotepadWithoutTasks>(
        MONGO_COLLECTIONS.notepads,
      );
      const notepad = await notepads.findOne({ _id: notepadId, userId });

      if (!notepad) {
        throw new NotFoundError(`Notepad ${notepadId} not found`);
      }
    }

    const filter = this.buildTaskFilter(
      userId,
      params,
      isCommonNotepad ? undefined : notepadId,
    );
    const sort = this.buildTaskSort(sortBy, order);

    return this.getPaginatedTasks(filter, sort, page, limit);
  }

  async updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<CreateNotepad>,
    userId: number,
  ): Promise<Notepad> {
    const db = await connectMongo();
    const notepadsCollection = db.collection<NotepadWithoutTasks>(
      MONGO_COLLECTIONS.notepads,
    );
    const tasksCollection = db.collection<Task>(MONGO_COLLECTIONS.tasks);

    try {
      const filter = { _id: notepadId, userId };
      const update = { $set: updatedNotepadFields };
      const notepad = await notepadsCollection.findOneAndUpdate(
        filter,
        update,
        {
          returnDocument: 'after',
        },
      );

      if (!notepad) {
        throw new NotFoundError(`Notepad ${notepadId} not found`);
      }

      const tasks = await tasksCollection.find({ notepadId, userId }).toArray();

      return { ...notepad, tasks };
    } catch (err) {
      if (isMongoDbError(err) && err.code === MONGO_DB_ERRORS.DUPLICATE) {
        throw new ConflictError(
          `The title ${updatedNotepadFields.title} is already in use`,
        );
      }

      throw err;
    }
  }

  async updateTask(
    taskId: string,
    updatedTaskFields: UpdateTask,
    userId: number,
  ): Promise<Task> {
    const db = await connectMongo();
    const tasksCollection = db.collection<Task>(MONGO_COLLECTIONS.tasks);
    const notepadsCollection = db.collection<NotepadWithoutTasks>(
      MONGO_COLLECTIONS.notepads,
    );

    const currentTask = await tasksCollection.findOne({ _id: taskId, userId });

    if (!currentTask) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    const newNotepadId = updatedTaskFields.notepadId ?? currentTask.notepadId;

    if (newNotepadId !== COMMON_NOTEPAD_ID) {
      const targetNotepad = await notepadsCollection.findOne({
        _id: newNotepadId,
        userId,
      });

      if (!targetNotepad) {
        throw new NotFoundError(`Notebook ${newNotepadId} not found`);
      }
    }

    const { dueDate, subtasks, ...restFields } = updatedTaskFields;
    const update: {
      $set: Partial<Task>;
      $unset?: Partial<Record<keyof Task, ''>>;
    } = {
      $set: { ...restFields },
    };

    if (subtasks !== undefined) {
      update.$set.subtasks = subtasks;
      update.$set.progress = this.calculateProgress(subtasks);
    }

    if (dueDate === null) {
      update.$unset = { dueDate: '' };
    } else if (dueDate !== undefined) {
      update.$set.dueDate = dueDate;
    }

    const task = await tasksCollection.findOneAndUpdate(
      { _id: taskId, userId },
      update,
      { returnDocument: 'after' },
    );

    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    return task;
  }

  async deleteNotepad(notepadId: string, userId: number): Promise<void> {
    if (notepadId === COMMON_NOTEPAD_ID) {
      throw new ForbiddenError(`Cannot delete the common notepad`);
    }

    await withMongoTransaction(async (db, session) => {
      const notepadsCollection = db.collection<NotepadWithoutTasks>(
        MONGO_COLLECTIONS.notepads,
      );
      const tasksCollection = db.collection<Task>(MONGO_COLLECTIONS.tasks);

      const result = await notepadsCollection.deleteOne(
        { _id: notepadId, userId },
        { session },
      );

      if (result.deletedCount === 0) {
        throw new NotFoundError(`Notepad ${notepadId} not found`);
      }

      await tasksCollection.deleteMany({ notepadId, userId }, { session });
    });
  }

  async deleteTask(taskId: string, userId: number): Promise<void> {
    const db = await connectMongo();
    const tasksCollection = db.collection<Task>(MONGO_COLLECTIONS.tasks);

    const result = await tasksCollection.deleteOne({ _id: taskId, userId });

    if (result.deletedCount === 0) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }
  }
}
