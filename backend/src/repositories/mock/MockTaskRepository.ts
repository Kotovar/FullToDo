import type {
  Task,
  Notepad,
  CreateNotepad,
  CreateTask,
  Subtask,
  TaskQueryParams,
  PaginationMeta,
  NotepadWithoutTasks,
  PaginatedTasks,
} from '@sharedCommon/schemas';
import { COMMON_NOTEPAD_ID, PAGINATION } from '@sharedCommon/schemas';
import { ConflictError, ForbiddenError, NotFoundError } from '@errors/AppError';
import type { TaskRepository } from '@repositories/interfaces';

export const DEFAULT_TASK_PARAMS: TaskQueryParams = {
  sortBy: 'createdDate',
};

type Paginate = {
  paginatedTasks: Task[];
  meta: PaginationMeta;
};

export class MockTaskRepository implements TaskRepository {
  private tasks: Task[];
  private notepads: Notepad[];

  constructor(initialNotepads: Notepad[]) {
    this.notepads = structuredClone(initialNotepads);
    this.tasks = initialNotepads.flatMap(notepad => notepad.tasks);
  }

  private applyTaskFilters(tasks: Task[], params?: TaskQueryParams): Task[] {
    if (!params) {
      return tasks;
    }

    const { isCompleted, hasDueDate, sortBy: sortByOriginal, order } = params;

    const sortBy = sortByOriginal ?? DEFAULT_TASK_PARAMS.sortBy;
    let result = [...tasks];

    if (isCompleted !== undefined) {
      result = result.filter(task =>
        isCompleted === 'true' ? task.isCompleted : !task.isCompleted,
      );
    }

    if (hasDueDate !== undefined) {
      result = result.filter(task =>
        hasDueDate === 'true' ? !!task.dueDate : !task.dueDate,
      );
    }

    if (sortBy) {
      result = result.toSorted((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (valA === null || valA === undefined)
          return order === 'asc' ? 1 : -1;
        if (valB === null || valB === undefined)
          return order === 'asc' ? -1 : 1;

        const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
        return order === 'asc' ? cmp : -cmp;
      });
    }

    if (params.search?.trim()) {
      const searchTerm = params.search.toLowerCase().trim();

      result = result.filter(
        task =>
          task.title.toLowerCase().includes(searchTerm) ||
          task.description?.toLowerCase().includes(searchTerm),
      );
    }

    return result;
  }

  private paginate(items: Task[], params?: TaskQueryParams): Paginate {
    const page = params?.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = params?.limit ?? PAGINATION.DEFAULT_LIMIT;
    const total = items.length;
    const totalPages = Math.ceil(total / limit);

    const start = (page - 1) * limit;
    const paginatedTasks = items.slice(start, start + limit);

    return {
      paginatedTasks,
      meta: { page, limit, total, totalPages },
    };
  }

  private generateId(): string {
    return globalThis.crypto.randomUUID();
  }

  private calculateProgress(subtasks?: Subtask[]): string {
    if (!subtasks?.length) return '';
    const completed = subtasks.filter(subtask => subtask.isCompleted).length;
    return `${completed}/${subtasks.length}`;
  }

  async createNotepad(
    { title }: CreateNotepad,
    userId: number,
  ): Promise<Notepad> {
    if (
      this.notepads.some(
        notepad => notepad.title === title && notepad.userId === userId,
      )
    ) {
      throw new ConflictError(`Notebook with title ${title} already exists`);
    }

    const newNotepad = {
      _id: this.generateId(),
      title,
      tasks: [],
      userId,
    };
    this.notepads.push(newNotepad);

    return newNotepad;
  }

  async createTask(
    task: CreateTask,
    notepadId: string,
    userId: number,
  ): Promise<Task> {
    const { title, dueDate, description } = task;
    const isCommonNotepad = notepadId === COMMON_NOTEPAD_ID;
    const targetNotepad = this.notepads.find(
      notepad => notepad._id === notepadId && notepad.userId === userId,
    );

    if (!isCommonNotepad && !targetNotepad) {
      throw new NotFoundError(`Notebook ${notepadId} not found`);
    }

    const newTask: Task = {
      _id: this.generateId(),
      createdDate: new Date(),
      isCompleted: false,
      subtasks: [],
      progress: '',
      description,
      dueDate,
      notepadId,
      title,
      userId,
    };

    this.tasks.push(newTask);

    if (!isCommonNotepad) {
      targetNotepad?.tasks.push(newTask);
    }

    return newTask;
  }

  async getAllNotepads(userId: number): Promise<NotepadWithoutTasks[]> {
    return [
      { title: 'Задачи', _id: COMMON_NOTEPAD_ID, userId },
      ...this.notepads
        .filter(notepad => notepad.userId === userId)
        .map(({ tasks: _, ...rest }) => rest),
    ];
  }

  async getAllTasks(
    userId: number,
    params?: TaskQueryParams,
  ): Promise<PaginatedTasks> {
    const userTasks = this.tasks.filter(task => task.userId === userId);
    const filteredTasks = this.applyTaskFilters(userTasks, params);
    const { paginatedTasks: tasks, meta } = this.paginate(
      filteredTasks,
      params,
    );

    return { tasks, meta };
  }

  async getSingleTask(
    notepadId: string,
    taskId: string,
    userId: number,
  ): Promise<Task> {
    const task = this.tasks.find(
      task => task._id === taskId && task.userId === userId,
    );
    const suitableNotepad =
      notepadId === COMMON_NOTEPAD_ID || task?.notepadId === notepadId;

    if (!suitableNotepad || !task) {
      throw new NotFoundError(
        `Task ${taskId} not found in notepad ${notepadId}`,
      );
    }

    return task;
  }

  async getSingleNotepadTasks(
    notepadId: string,
    userId: number,
    params?: TaskQueryParams,
  ): Promise<PaginatedTasks> {
    const isCommonNotepad = notepadId === COMMON_NOTEPAD_ID;

    if (!isCommonNotepad) {
      const notepad = this.notepads.find(
        notepad => notepad._id === notepadId && notepad.userId === userId,
      );

      if (!notepad) {
        throw new NotFoundError(`Notepad ${notepadId} not found`);
      }
    }

    const filteredByNotebook = this.tasks.filter(task => {
      if (task.userId !== userId) return false;
      return isCommonNotepad || task.notepadId === notepadId;
    });

    const filteredTasks = this.applyTaskFilters(filteredByNotebook, params);
    const { paginatedTasks: tasks, meta } = this.paginate(
      filteredTasks,
      params,
    );

    return { tasks, meta };
  }

  async updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<CreateNotepad>,
    userId: number,
  ): Promise<Notepad> {
    const notepadIndex = this.notepads.findIndex(
      notepad => notepad._id === notepadId && notepad.userId === userId,
    );

    if (notepadIndex === -1) {
      throw new NotFoundError(`Notepad ${notepadId} not found`);
    }

    if (
      updatedNotepadFields.title &&
      this.notepads.some(
        notepad =>
          notepad._id !== notepadId &&
          notepad.userId === userId &&
          notepad.title === updatedNotepadFields.title,
      )
    ) {
      throw new ConflictError(
        `The title ${updatedNotepadFields.title} is already in use`,
      );
    }

    this.notepads[notepadIndex] = {
      ...this.notepads[notepadIndex],
      ...updatedNotepadFields,
    };

    return this.notepads[notepadIndex];
  }

  async updateTask(
    taskId: string,
    updatedTaskFields: Partial<Task>,
    userId: number,
  ): Promise<Task> {
    const taskIndex = this.tasks.findIndex(
      task => task._id === taskId && task.userId === userId,
    );

    if (taskIndex === -1) {
      throw new NotFoundError('Task not found');
    }

    const currentTask = { ...this.tasks[taskIndex] };
    const newNotepadId = updatedTaskFields.notepadId ?? currentTask.notepadId;
    const targetNotepad = this.notepads.find(
      notepad => notepad._id === newNotepadId && notepad.userId === userId,
    );

    if (!targetNotepad && newNotepadId !== COMMON_NOTEPAD_ID) {
      throw new NotFoundError(`Notebook ${newNotepadId} not found`);
    }

    const subtasks = updatedTaskFields.subtasks ?? currentTask.subtasks;
    const progress = updatedTaskFields.subtasks
      ? this.calculateProgress(subtasks)
      : currentTask.progress;

    const updatedTask = {
      ...currentTask,
      ...updatedTaskFields,
      _id: currentTask._id,
      progress,
      subtasks,
    };

    if (updatedTaskFields.dueDate === null) {
      delete updatedTask.dueDate;
    } else if (updatedTaskFields.dueDate !== undefined) {
      updatedTask.dueDate = updatedTaskFields.dueDate;
    }

    this.tasks[taskIndex] = updatedTask;
    const shouldMoveNotepad = newNotepadId !== currentTask.notepadId;

    const currentNotepad =
      currentTask.notepadId !== COMMON_NOTEPAD_ID
        ? this.notepads.find(
            notepad =>
              notepad._id === currentTask.notepadId &&
              notepad.userId === userId,
          )
        : null;

    if (shouldMoveNotepad) {
      if (currentNotepad) {
        currentNotepad.tasks = currentNotepad.tasks.filter(
          task => task._id !== taskId,
        );
      }

      targetNotepad?.tasks.push(updatedTask);
    } else if (currentNotepad) {
      const notepadTaskIndex = currentNotepad?.tasks.findIndex(
        task => task._id === taskId,
      );
      if (notepadTaskIndex !== -1) {
        currentNotepad.tasks[notepadTaskIndex] = updatedTask;
      }
    }

    return this.tasks[taskIndex];
  }

  async deleteNotepad(notepadId: string, userId: number): Promise<void> {
    if (notepadId === COMMON_NOTEPAD_ID) {
      throw new ForbiddenError(`Cannot delete the common notepad`);
    }

    const notepadIndex = this.notepads.findIndex(
      notepad => notepad._id === notepadId && notepad.userId === userId,
    );

    if (notepadIndex === -1) {
      throw new NotFoundError(`Notepad ${notepadId} not found`);
    }

    this.notepads.splice(notepadIndex, 1);
    this.tasks = this.tasks.filter(task => task.notepadId !== notepadId);
  }

  async deleteTask(taskId: string, userId: number): Promise<void> {
    const taskIndex = this.tasks.findIndex(
      task => task._id === taskId && task.userId === userId,
    );

    if (taskIndex === -1) {
      throw new NotFoundError(`Task with id ${taskId} not found`);
    }

    const taskToDelete = this.tasks[taskIndex];
    const isCommonNotepad = taskToDelete.notepadId === COMMON_NOTEPAD_ID;
    this.tasks.splice(taskIndex, 1);

    if (!isCommonNotepad) {
      const notepad = this.notepads.find(
        notepad =>
          notepad._id === taskToDelete.notepadId && notepad.userId === userId,
      );

      if (notepad) {
        notepad.tasks = notepad.tasks?.filter(task => task._id !== taskId);
      }
    }
  }
}
