import { getPrisma } from '@db/prisma/client';
import { isPrismaError } from '@db/prisma/errors';
import { Prisma } from '@prisma/client';
import { ConflictError, ForbiddenError, NotFoundError } from '@errors/AppError';
import { TaskRepository } from '@repositories/interfaces';
import {
  COMMON_NOTEPAD_ID,
  PAGINATION,
  type CreateNotepad,
  type CreateTask,
  type Notepad,
  type NotepadWithoutTasks,
  type PaginatedTasks,
  type Task,
  type TaskQueryParams,
  type UpdateTask,
} from '@sharedCommon/schemas';

/**
 * Вычисляет строку прогресса подзадач (например, "2/5").
 *
 * @param subtasks — массив подзадач из Prisma (или любых объектов с `isCompleted`)
 * @returns строка прогресса либо пустая строка, если подзадач нет
 */
const calculateProgress = (subtasks: { isCompleted: boolean }[]): string => {
  if (subtasks.length === 0) return '';
  const completed = subtasks.filter(s => s.isCompleted).length;
  return `${completed}/${subtasks.length}`;
};

/**
 * Преобразует Task, полученную из Prisma (вместе с подзадачами),
 * в тип `Task` приложения.
 *
 * Все `bigint`-поля (`id`, `notepadId`, `userId`, `_id` подзадач)
 * конвертируются в `string` / `number`, чтобы соответствовать Zod-схемам.
 */
const prismaTaskToTask = (task: {
  id: bigint;
  notepadId: bigint | null;
  userId: bigint;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdDate: Date;
  dueDate: Date | null;
  subtasks: { id: bigint; title: string; isCompleted: boolean }[];
}): Task => ({
  _id: task.id.toString(),
  notepadId: task.notepadId?.toString() ?? COMMON_NOTEPAD_ID,
  userId: Number(task.userId),
  title: task.title,
  description: task.description ?? undefined,
  isCompleted: task.isCompleted,
  createdDate: task.createdDate,
  dueDate: task.dueDate,
  subtasks: task.subtasks.map(s => ({
    _id: s.id.toString(),
    title: s.title,
    isCompleted: s.isCompleted,
  })),
  progress: calculateProgress(task.subtasks),
});

/**
 * Репозиторий задач и блокнотов на Prisma.
 *
 * Ключевые особенности:
 * - В БД `_id` хранятся как `BigInt`, а в API — как `string`.
 *   Поэтому перед запросами делаем `BigInt(stringId)`,
 *   а после — `.toString()`.
 * - `notepadId = null` в БД означает «общий блокнот» (`COMMON_NOTEPAD_ID = 'all'`).
 * - Подзадачи (`subtasks`) живут в отдельной таблице;
 *   при обновлении задачи старые подзадачи удаляются и создаются заново (replace).
 * - Для проверки ownership (пользователь ≠ владелец) используем `findFirst`
 *   с фильтром `userId`, чтобы получить 404 вместо 403.
 */
export class PrismaTaskRepository implements TaskRepository {
  /**
   * Создаёт новый блокнот.
   *
   * Prisma-метод: `getPrisma().notepad.create({ data: { title, userId } })`
   *
   * Уникальность пары `(userId, title)` задана в схеме (`@@unique`).
   * При нарушении ловим код `P2002` и бросаем `ConflictError`.
   */
  async createNotepad(
    { title }: CreateNotepad,
    userId: number,
  ): Promise<Notepad> {
    try {
      const notepad = await getPrisma().notepad.create({
        data: { title, userId },
      });

      return {
        _id: notepad.id.toString(),
        title: notepad.title,
        userId: Number(notepad.userId),
        tasks: [],
      };
    } catch (err) {
      if (isPrismaError(err, 'P2002')) {
        throw new ConflictError(`Notepad with title ${title} already exists`);
      }
      throw err;
    }
  }

  /**
   * Создаёт новую задачу.
   *
   * Prisma-метод: `getPrisma().task.create({ data, include: { subtasks: true } })`
   *
   * Если `notepadId === 'all'`, в БД пишем `null` (общий блокнот).
   * Если передан конкретный `notepadId`, но блокнота нет,
   * Prisma вернёт ошибку внешнего ключа `P2003` → `NotFoundError`.
   */
  async createTask(
    task: CreateTask,
    notepadId: string,
    userId: number,
  ): Promise<Task> {
    const dbNotepadId =
      notepadId === COMMON_NOTEPAD_ID ? null : BigInt(notepadId);

    try {
      const created = await getPrisma().task.create({
        data: {
          userId,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          notepadId: dbNotepadId,
        },
        include: { subtasks: true },
      });

      return prismaTaskToTask(created);
    } catch (err) {
      if (isPrismaError(err, 'P2003')) {
        throw new NotFoundError(`Notebook ${notepadId} not found`);
      }
      if (isPrismaError(err, 'P2002')) {
        throw new ConflictError(`Task with title ${task.title} already exists`);
      }
      throw err;
    }
  }

  /**
   * Возвращает все блокноты пользователя + общий блокнот в начале.
   *
   * Prisma-метод: `getPrisma().notepad.findMany({ where: { userId } })`
   */
  async getAllNotepads(userId: number): Promise<NotepadWithoutTasks[]> {
    const notepads = await getPrisma().notepad.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
    });

    return [
      { title: 'Задачи', _id: COMMON_NOTEPAD_ID, userId },
      ...notepads.map((n: { id: bigint; title: string; userId: bigint }) => ({
        _id: n.id.toString(),
        title: n.title,
        userId: Number(n.userId),
      })),
    ];
  }

  /**
   * Возвращает все задачи пользователя с пагинацией, фильтрами и сортировкой.
   *
   * Prisma-методы:
   * - `getPrisma().task.findMany({ where, orderBy, skip, take, include: { subtasks: true } })`
   * - `getPrisma().task.count({ where })`
   *
   * Фильтры:
   * - `search` — поиск по `title` (регистронезависимый, `mode: 'insensitive'`)
   * - `isCompleted` — фильтр по флагу выполнения
   * - `hasDueDate` — проверка наличия / отсутствия дедлайна
   */
  async getAllTasks(
    userId: number,
    params: TaskQueryParams = {},
  ): Promise<PaginatedTasks> {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      search,
      sortBy = 'createdDate',
      order = 'desc',
      isCompleted,
      hasDueDate,
    } = params;

    const where: Prisma.TaskWhereInput = { userId };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (isCompleted !== undefined) {
      where.isCompleted = isCompleted === 'true';
    }

    if (hasDueDate !== undefined) {
      where.dueDate = hasDueDate === 'true' ? { not: null } : null;
    }

    const [tasks, total] = await Promise.all([
      getPrisma().task.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: { subtasks: true },
      }),
      getPrisma().task.count({ where }),
    ]);

    return {
      tasks: tasks.map(prismaTaskToTask),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Возвращает одну задачу по ID блокнота, ID задачи и ID пользователя.
   *
   * Prisma-метод: `getPrisma().task.findFirst({ where, include: { subtasks: true } })`
   *
   * Для общего блокнота (`'all'`) ищем задачу с `notepadId = null`.
   * Если задача не найдена или не принадлежит пользователю — `NotFoundError`.
   */
  async getSingleTask(
    notepadId: string,
    taskId: string,
    userId: number,
  ): Promise<Task> {
    const isCommon = notepadId === COMMON_NOTEPAD_ID;

    const task = await getPrisma().task.findFirst({
      where: {
        id: BigInt(taskId),
        userId,
        notepadId: isCommon ? null : BigInt(notepadId),
      },
      include: { subtasks: true },
    });

    if (!task) {
      throw new NotFoundError(
        `Task ${taskId} not found in notepad ${notepadId}`,
      );
    }

    return prismaTaskToTask(task);
  }

  /**
   * Возвращает задачи конкретного блокнота с пагинацией.
   *
   * Сначала проверяем существование блокнота (кроме общего).
   * Затем делаем `findMany` + `count` по фильтрам.
   *
   * Prisma-методы:
   * - `getPrisma().notepad.findFirst(...)` — проверка ownership
   * - `getPrisma().task.findMany(...)` — список задач
   * - `getPrisma().task.count(...)` — общее количество
   */
  async getSingleNotepadTasks(
    notepadId: string,
    userId: number,
    params: TaskQueryParams = {},
  ): Promise<PaginatedTasks> {
    const isCommon = notepadId === COMMON_NOTEPAD_ID;

    if (!isCommon) {
      const notepad = await getPrisma().notepad.findFirst({
        where: { id: BigInt(notepadId), userId },
      });
      if (!notepad) {
        throw new NotFoundError(`Notepad ${notepadId} not found`);
      }
    }

    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      search,
      sortBy = 'createdDate',
      order = 'desc',
      isCompleted,
      hasDueDate,
    } = params;

    const where: Prisma.TaskWhereInput = { userId };

    if (isCommon) {
      where.notepadId = null;
    } else {
      where.notepadId = BigInt(notepadId);
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (isCompleted !== undefined) {
      where.isCompleted = isCompleted === 'true';
    }

    if (hasDueDate !== undefined) {
      where.dueDate = hasDueDate === 'true' ? { not: null } : null;
    }

    const [tasks, total] = await Promise.all([
      getPrisma().task.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: { subtasks: true },
      }),
      getPrisma().task.count({ where }),
    ]);

    return {
      tasks: tasks.map(prismaTaskToTask),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Обновляет название блокнота.
   *
   * Prisma-методы:
   * - `getPrisma().notepad.findFirst(...)` — проверка существования и ownership
   * - `getPrisma().notepad.update(...)` — обновление title
   * - `getPrisma().task.findMany(...)` — получение задач блокнота для ответа
   */
  async updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<CreateNotepad>,
    userId: number,
  ): Promise<Notepad> {
    try {
      const existing = await getPrisma().notepad.findFirst({
        where: { id: BigInt(notepadId), userId },
      });
      if (!existing) {
        throw new NotFoundError(`Notepad ${notepadId} not found`);
      }

      const updated = await getPrisma().notepad.update({
        where: { id: BigInt(notepadId) },
        data: { title: updatedNotepadFields.title },
      });

      const tasks = await getPrisma().task.findMany({
        where: { notepadId: BigInt(notepadId), userId },
        include: { subtasks: true },
      });

      return {
        _id: updated.id.toString(),
        title: updated.title,
        userId: Number(updated.userId),
        tasks: tasks.map(prismaTaskToTask),
      };
    } catch (err) {
      if (isPrismaError(err, 'P2002')) {
        throw new ConflictError(
          `The title ${updatedNotepadFields.title} is already in use`,
        );
      }
      throw err;
    }
  }

  /**
   * Обновляет задачу, включая полное замещение подзадач.
   *
   * Алгоритм:
   * 1. `findFirst` — проверяем, что задача существует и принадлежит пользователю.
   * 2. Если передан новый `notepadId` (не 'all'), проверяем его существование.
   * 3. `getPrisma().task.update(...)` — обновляем поля задачи.
   * 4. Если переданы `subtasks`:
   *    - `getPrisma().subtask.deleteMany({ where: { taskId } })` — удаляем старые
   *    - `getPrisma().subtask.createMany(...)` — создаём новые
   * 5. Перечитываем задачу с подзадачами и возвращаем.
   */
  async updateTask(
    taskId: string,
    fields: Partial<UpdateTask>,
    userId: number,
  ): Promise<Task> {
    const { subtasks, ...taskFields } = fields;

    // 1. Проверка существования и ownership
    const existing = await getPrisma().task.findFirst({
      where: { id: BigInt(taskId), userId },
      include: { subtasks: true },
    });
    if (!existing) {
      throw new NotFoundError(`Task ${taskId} not found`);
    }

    // 2. Проверка целевого блокнота, если меняем
    if (taskFields.notepadId && taskFields.notepadId !== COMMON_NOTEPAD_ID) {
      const notepad = await getPrisma().notepad.findFirst({
        where: { id: BigInt(taskFields.notepadId), userId },
      });
      if (!notepad) {
        throw new NotFoundError(`Notebook ${taskFields.notepadId} not found`);
      }
    }

    // 3. Подготовка данных для обновления
    const data: Prisma.TaskUpdateInput = {};

    if (taskFields.title !== undefined) data.title = taskFields.title;
    if (taskFields.description !== undefined)
      data.description = taskFields.description;
    if (taskFields.isCompleted !== undefined)
      data.isCompleted = taskFields.isCompleted;
    if (taskFields.dueDate !== undefined) data.dueDate = taskFields.dueDate;
    if (taskFields.notepadId !== undefined) {
      if (taskFields.notepadId === COMMON_NOTEPAD_ID) {
        data.notepad = { disconnect: true };
      } else {
        data.notepad = { connect: { id: BigInt(taskFields.notepadId) } };
      }
    }

    // Обновляем основные поля задачи
    let updated = existing;
    if (Object.keys(data).length > 0) {
      updated = await getPrisma().task.update({
        where: { id: BigInt(taskId) },
        data,
        include: { subtasks: true },
      });
    }

    // 4. Полное замещение подзадач
    if (subtasks !== undefined) {
      await getPrisma().subtask.deleteMany({
        where: { taskId: BigInt(taskId) },
      });

      if (subtasks.length > 0) {
        await getPrisma().subtask.createMany({
          data: subtasks.map(s => ({
            taskId: BigInt(taskId),
            title: s.title,
            isCompleted: s.isCompleted ?? false,
          })),
        });
      }

      // Перечитываем задачу с актуальными подзадачами
      const refreshed = await getPrisma().task.findFirst({
        where: { id: BigInt(taskId), userId },
        include: { subtasks: true },
      });

      if (refreshed) {
        updated = refreshed;
      }
    }

    return prismaTaskToTask(updated);
  }

  /**
   * Удаляет блокнот.
   *
   * Prisma-метод: `getPrisma().notepad.deleteMany({ where: { id, userId } })`
   *
   * Общий блокнот (`'all'`) удалять запрещено — `ForbiddenError`.
   * `deleteMany` возвращает `count`; если 0 — значит, блокнота нет или
   * он чужой → `NotFoundError`.
   */
  async deleteNotepad(notepadId: string, userId: number): Promise<void> {
    if (notepadId === COMMON_NOTEPAD_ID) {
      throw new ForbiddenError('Cannot delete the common notepad');
    }

    const result = await getPrisma().notepad.deleteMany({
      where: { id: BigInt(notepadId), userId },
    });

    if (result.count === 0) {
      throw new NotFoundError(`Notepad ${notepadId} not found`);
    }
  }

  /**
   * Удаляет задачу.
   *
   * Prisma-метод: `getPrisma().task.deleteMany({ where: { id, userId } })`
   *
   * Если задача не найдена или не принадлежит пользователю — `NotFoundError`.
   */
  async deleteTask(taskId: string, userId: number): Promise<void> {
    const result = await getPrisma().task.deleteMany({
      where: { id: BigInt(taskId), userId },
    });

    if (result.count === 0) {
      throw new NotFoundError(`Task with id ${taskId} not found`);
    }
  }
}
