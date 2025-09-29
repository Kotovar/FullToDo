import { NOTEPADS } from '@db/mock/mock-db';
import type {
  Task,
  Notepad,
  TasksResponse,
  NotepadWithoutTasksResponse,
  NotepadResponse,
  CreateNotepad,
  CreateTask,
  Subtask,
  TaskQueryParams,
  PaginationMeta,
  TaskResponseSingle,
  TaskResponse,
} from '@sharedCommon/schemas';
import { commonNotepadId, PAGINATION } from '@sharedCommon/schemas';
import type { TaskRepository } from './TaskRepository';

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

    const {
      isCompleted,
      hasDueDate,
      priority,
      sortBy: sortByOriginal,
      order,
    } = params;

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

    if (priority) {
      result = result.filter(task => task.priority === priority);
    }

    if (sortBy) {
      result = result.toSorted((a, b) => {
        if (sortBy === 'priority') {
          const priorityOrder = { low: 0, medium: 1, high: 2 };
          const aVal = a.priority ? priorityOrder[a.priority] : -1;
          const bVal = b.priority ? priorityOrder[b.priority] : -1;
          return order === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const valA = a[sortBy];
        const valB = b[sortBy];

        if (valA === null || valA === undefined)
          return order === 'asc' ? 1 : -1;
        if (valB === null || valB === undefined)
          return order === 'asc' ? -1 : 1;
        if (valA === valB) return 0;

        return order === 'asc' ? (valA < valB ? -1 : 1) : valA < valB ? 1 : -1;
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

  private validateNotepadExistence(
    id: string,
    isCommonNotepad: boolean,
  ): { status: 404; message: string } | null {
    const isRealNotepad = this.notepads.some(notepad => notepad._id === id);
    return !isRealNotepad && !isCommonNotepad
      ? { status: 404, message: 'Notepad not found' }
      : null;
  }

  private generateTaskId(): string {
    return globalThis.crypto.randomUUID();
  }

  private calculateProgress(subtasks?: Subtask[]): string {
    if (!subtasks?.length) return '';
    const completed = subtasks.filter(subtask => subtask.isCompleted).length;
    return `${completed}/${subtasks.length}`;
  }

  async createNotepad({ title }: CreateNotepad): Promise<NotepadResponse> {
    if (this.notepads.some(notepad => notepad.title === title)) {
      return {
        status: 409,
        message: `A notebook with the title ${title} already exists`,
      };
    }
    this.notepads.push({
      _id: this.generateTaskId(),
      title: title,
      tasks: [],
    });

    return {
      status: 201,
      message: `A notebook with the title ${title} has been successfully created`,
    };
  }

  async createTask(
    task: CreateTask,
    notepadId: string,
  ): Promise<TaskResponseSingle> {
    const { title, dueDate, description } = task;
    const isCommonNotepad = notepadId === commonNotepadId;
    const notepadError = this.validateNotepadExistence(
      notepadId,
      isCommonNotepad,
    );

    if (notepadError) return notepadError;

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
    };

    this.tasks.push(newTask);

    if (!isCommonNotepad) {
      const targetNotepad = this.notepads.find(
        notepad => notepad._id === notepadId,
      );

      if (targetNotepad) {
        targetNotepad.tasks.push(newTask);
      }
    }

    return {
      status: 201,
      message: `Task with the title ${title} has been successfully created`,
    };
  }

  async getAllNotepads(): Promise<NotepadWithoutTasksResponse> {
    const notepadsWithoutTasks = [
      { title: 'Задачи', _id: commonNotepadId },
    ].concat(this.notepads.map(({ tasks: _, ...rest }) => rest));

    return {
      status: 200,
      message: 'Success',
      data: notepadsWithoutTasks,
    };
  }

  async getAllTasks(params?: TaskQueryParams): Promise<TasksResponse> {
    const filteredTasks = this.applyTaskFilters(this.tasks, params);
    const { paginatedTasks, meta } = this.paginate(filteredTasks, params);

    return {
      status: 200,
      message: 'Success',
      data: paginatedTasks,
      meta,
    };
  }

  async getSingleTask(
    notepadId: string,
    taskId: string,
  ): Promise<TaskResponse> {
    const task = this.tasks.find(task => task._id === taskId);
    const suitableNotepad =
      notepadId === commonNotepadId || task?.notepadId === notepadId;

    if (suitableNotepad && task) {
      return {
        status: 200,
        message: 'Success',
        data: task,
      };
    }

    return {
      status: 404,
      message: `Task ${taskId} not found`,
      data: undefined,
    };
  }

  async getSingleNotepadTasks(
    notepadId: string,
    params?: TaskQueryParams,
  ): Promise<TasksResponse> {
    if (!this.notepads.some(notepad => notepad._id === notepadId)) {
      const { meta } = this.paginate([], params);

      return {
        status: 404,
        message: `Notepad ${notepadId} not found`,
        data: [],
        meta,
      };
    }

    const filteredByNotebook = this.tasks.filter(
      task => task.notepadId === notepadId,
    );

    const filteredTasks = this.applyTaskFilters(filteredByNotebook, params);
    const { paginatedTasks, meta } = this.paginate(filteredTasks, params);

    return {
      status: 200,
      message: 'Success',
      data: paginatedTasks,
      meta,
    };
  }

  async updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<CreateNotepad>,
  ): Promise<NotepadResponse> {
    const notepadIndex = this.notepads.findIndex(
      notepad => notepad._id === notepadId,
    );

    if (notepadIndex === -1) {
      return { status: 404, message: 'Notepad not found' };
    }

    if (
      updatedNotepadFields.title &&
      this.notepads.some(
        notepad => notepad.title === updatedNotepadFields.title,
      )
    ) {
      return {
        status: 409,
        message: `The title ${updatedNotepadFields.title} is already in use`,
      };
    }

    this.notepads[notepadIndex] = {
      ...this.notepads[notepadIndex],
      ...updatedNotepadFields,
    };

    return {
      status: 200,
      message: `A notepad with the id ${notepadId} has been successfully updated`,
      data: this.notepads[notepadIndex],
    };
  }

  async updateTask(
    taskId: string,
    updatedTaskFields: Partial<Task>,
  ): Promise<TaskResponseSingle> {
    const taskIndex = this.tasks.findIndex(task => task._id === taskId);
    if (taskIndex === -1) {
      return { status: 404, message: 'Task not found' };
    }

    const currentTask = { ...this.tasks[taskIndex] };
    const newNotepadId = updatedTaskFields.notepadId ?? currentTask.notepadId;
    const isCommonNotepad = newNotepadId === commonNotepadId;
    const notepadError = this.validateNotepadExistence(
      newNotepadId,
      isCommonNotepad,
    );

    if (notepadError) return notepadError;

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
      currentTask.notepadId !== commonNotepadId
        ? this.notepads.find(notepad => notepad._id === currentTask.notepadId)
        : null;

    const targetNotepad =
      newNotepadId !== commonNotepadId
        ? this.notepads.find(notepad => notepad._id === newNotepadId)
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

    return {
      status: 200,
      message: `A task with the _id ${taskId} has been successfully updated`,
      data: this.tasks[taskIndex],
    };
  }

  async deleteNotepad(notepadId: string): Promise<NotepadResponse> {
    const notepadIndex = this.notepads.findIndex(
      notepad => notepad._id === notepadId,
    );

    if (notepadIndex === -1 || notepadId === commonNotepadId) {
      return { status: 404, message: 'Notepad not found' };
    }

    this.notepads.splice(notepadIndex, 1);
    this.tasks = this.tasks.filter(task => task.notepadId !== notepadId);

    return {
      status: 200,
      message: 'Notepad deleted successfully',
    };
  }

  async deleteTask(taskId: string): Promise<TaskResponseSingle> {
    const taskIndex = this.tasks.findIndex(task => task._id === taskId);

    if (taskIndex === -1) {
      return { status: 404, message: 'Task not found' };
    }

    const taskToDelete = this.tasks[taskIndex];
    const isCommonNotepad = taskToDelete.notepadId === commonNotepadId;
    this.tasks.splice(taskIndex, 1);

    if (!isCommonNotepad) {
      const notepad = this.notepads.find(
        notepad => notepad._id === taskToDelete.notepadId,
      );

      if (notepad) {
        notepad.tasks = notepad.tasks?.filter(task => task._id !== taskId);
      }
    }

    return {
      status: 200,
      message: 'Task deleted successfully',
    };
  }
}

export default new MockTaskRepository(NOTEPADS);
