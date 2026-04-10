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
import { COMMON_NOTEPAD_ID, PAGINATION, USER_ID } from '@sharedCommon/schemas';
import { ConflictError, ForbiddenError, NotFoundError } from '@errors/AppError';
import type { TaskRepository } from '@repositories/interfaces/TaskRepository';

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

  private generateTaskId(): string {
    return globalThis.crypto.randomUUID();
  }

  private calculateProgress(subtasks?: Subtask[]): string {
    if (!subtasks?.length) return '';
    const completed = subtasks.filter(subtask => subtask.isCompleted).length;
    return `${completed}/${subtasks.length}`;
  }

  async createNotepad({ title }: CreateNotepad): Promise<Notepad> {
    if (this.notepads.some(notepad => notepad.title === title)) {
      throw new ConflictError(`Notebook with title ${title} already exists`);
    }

    const newNotepad = {
      _id: this.generateTaskId(),
      title: title,
      tasks: [],
      userId: USER_ID,
    };
    this.notepads.push(newNotepad);

    return newNotepad;
  }

  async createTask(task: CreateTask, notepadId: string): Promise<Task> {
    const { title, dueDate, description } = task;
    const isCommonNotepad = notepadId === COMMON_NOTEPAD_ID;
    const targetNotepad = this.notepads.find(
      notepad => notepad._id === notepadId,
    );

    if (!isCommonNotepad && !targetNotepad) {
      throw new NotFoundError(`Notebook ${notepadId} not found`);
    }

    const newTask: Task = {
      _id: this.generateTaskId(),
      createdDate: new Date(),
      isCompleted: false,
      subtasks: [],
      progress: '',
      description,
      dueDate,
      notepadId,
      title,
      userId: USER_ID,
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
      ...this.notepads.map(({ tasks: _, ...rest }) => rest),
    ];
  }

  async getAllTasks(params?: TaskQueryParams): Promise<PaginatedTasks> {
    const filteredTasks = this.applyTaskFilters(this.tasks, params);
    const { paginatedTasks: tasks, meta } = this.paginate(
      filteredTasks,
      params,
    );

    return { tasks, meta };
  }

  async getSingleTask(notepadId: string, taskId: string): Promise<Task> {
    const task = this.tasks.find(task => task._id === taskId);
    const suitableNotepad =
      notepadId === COMMON_NOTEPAD_ID || task?.notepadId === notepadId;

    if (suitableNotepad && task) {
      return task;
    }

    throw new NotFoundError(`Task ${taskId} not found in notepad ${notepadId}`);
  }

  async getSingleNotepadTasks(
    notepadId: string,
    params?: TaskQueryParams,
  ): Promise<PaginatedTasks> {
    if (!this.notepads.some(notepad => notepad._id === notepadId)) {
      throw new NotFoundError(`Notepad ${notepadId} not found`);
    }

    const filteredByNotebook = this.tasks.filter(
      task => task.notepadId === notepadId,
    );

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
  ): Promise<Notepad> {
    const notepadIndex = this.notepads.findIndex(
      notepad => notepad._id === notepadId,
    );

    if (notepadIndex === -1) {
      throw new NotFoundError(`Notepad ${notepadId} not found`);
    }

    if (
      updatedNotepadFields.title &&
      this.notepads.some(
        notepad => notepad.title === updatedNotepadFields.title,
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
  ): Promise<Task> {
    const taskIndex = this.tasks.findIndex(task => task._id === taskId);
    if (taskIndex === -1) {
      throw new NotFoundError('Task not found');
    }

    const currentTask = { ...this.tasks[taskIndex] };
    const newNotepadId = updatedTaskFields.notepadId ?? currentTask.notepadId;
    const targetNotepad = this.notepads.find(
      notepad => notepad._id === newNotepadId,
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
        ? this.notepads.find(notepad => notepad._id === currentTask.notepadId)
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

  async deleteNotepad(notepadId: string): Promise<void> {
    const notepadIndex = this.notepads.findIndex(
      notepad => notepad._id === notepadId,
    );

    if (notepadIndex === -1) {
      throw new NotFoundError(`Notepad ${notepadId} not found`);
    }

    if (notepadId === COMMON_NOTEPAD_ID) {
      throw new ForbiddenError(`Cannot delete the common notepad`);
    }

    this.notepads.splice(notepadIndex, 1);
    this.tasks = this.tasks.filter(task => task.notepadId !== notepadId);
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskIndex = this.tasks.findIndex(task => task._id === taskId);

    if (taskIndex === -1) {
      throw new NotFoundError(`Task with id ${taskId} not found`);
    }

    const taskToDelete = this.tasks[taskIndex];
    const isCommonNotepad = taskToDelete.notepadId === COMMON_NOTEPAD_ID;
    this.tasks.splice(taskIndex, 1);

    if (!isCommonNotepad) {
      const notepad = this.notepads.find(
        notepad => notepad._id === taskToDelete.notepadId,
      );

      if (notepad) {
        notepad.tasks = notepad.tasks?.filter(task => task._id !== taskId);
      }
    }
  }
}
