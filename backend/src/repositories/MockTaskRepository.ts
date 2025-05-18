import { v4 as uuidv4 } from 'uuid';

import { NOTEPADS } from '../db/mock/mock-db';
import type {
  Task,
  Notepad,
  TaskResponse,
  TasksResponse,
  NotepadWithoutTasksResponse,
  NotepadResponse,
  CreateNotepad,
  CreateTask,
  Subtask,
  TaskQueryParams,
} from '@shared/schemas';
import { commonNotepadId } from '@shared/schemas';
import type { TaskRepository } from './TaskRepository';

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

    const { isCompleted, hasDueDate, priority, sortBy, order } = params;

    let result = [...tasks];

    if (isCompleted !== undefined) {
      result = result.filter(task => task.isCompleted === isCompleted);
    }

    if (hasDueDate !== undefined) {
      result = result.filter(task =>
        hasDueDate ? !!task.dueDate : !task.dueDate,
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

        if (valA === undefined) return order === 'asc' ? 1 : -1;
        if (valB === undefined) return order === 'asc' ? -1 : 1;
        if (valA === valB) return 0;

        return order === 'asc' ? (valA < valB ? -1 : 1) : valA < valB ? 1 : -1;
      });
    }

    if (params.search !== undefined) {
      const searchTerm = params.search.toLowerCase().trim();

      if (searchTerm === '') {
        return result;
      }

      result = result.filter(
        task =>
          task.title.toLowerCase().includes(searchTerm) ||
          task.description?.toLowerCase().includes(searchTerm),
      );
    }

    return result;
  }

  private isValidNotepadId(id: string): boolean {
    return this.notepads.some(notepad => notepad._id === id);
  }

  private generateTaskId(): string {
    return uuidv4();
  }

  private calculateProgress(subtasks?: Subtask[]): string {
    if (!subtasks?.length) return '';
    const completed = subtasks.filter(subtask => subtask.isCompleted).length;
    return `${completed} из ${subtasks.length}`;
  }

  async createNotepad({ title }: CreateNotepad): Promise<NotepadResponse> {
    if (this.notepads.some(notepad => notepad.title === title)) {
      return {
        status: 409,
        message: `A notebook with the title ${title} already exists`,
      };
    }

    this.notepads.push({
      _id: uuidv4(),
      title: title,
      tasks: [],
    });

    return {
      status: 201,
      message: `A notebook with the title ${title} has been successfully created`,
    };
  }

  async createTask(task: CreateTask, notepadId: string): Promise<TaskResponse> {
    const { title, dueDate, description } = task;

    if (!this.isValidNotepadId(notepadId) && notepadId !== commonNotepadId) {
      return {
        status: 404,
        message: 'Notepad not found',
      };
    }

    const existingTask = this.tasks.some(
      task => task.title === title && task.notepadId === notepadId,
    );

    if (existingTask) {
      const notepadTitle =
        notepadId === commonNotepadId
          ? 'All tasks'
          : (this.notepads.find(notepad => notepad._id === notepadId)?.title ??
            'Unknown');

      return {
        status: 409,
        message: `Task with title ${title} already exists in ${notepadTitle}`,
      };
    }

    const newTask: Task = {
      title: title,
      _id: this.generateTaskId(),
      createdDate: new Date(),
      isCompleted: false,
      notepadId: notepadId,
      dueDate: dueDate,
      description: description,
      subtasks: [],
      progress: '',
    };

    this.tasks.push(newTask);

    if (notepadId !== commonNotepadId) {
      const targetNotepad = this.notepads.find(
        notepad => notepad._id === notepadId,
      );
      if (targetNotepad) {
        targetNotepad.tasks = targetNotepad.tasks ?? [];
        targetNotepad.tasks.push(newTask);
      }
    }

    return {
      status: 201,
      message: `A task with the title ${title} has been successfully created`,
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

    return {
      status: 200,
      message: 'Success',
      data: filteredTasks,
    };
  }

  async getSingleTask(taskId: string): Promise<TaskResponse> {
    const task = this.tasks.find(task => task._id === taskId);

    if (task) {
      return {
        status: 200,
        message: 'Success',
        data: task,
      };
    }

    return {
      status: 404,
      message: `Task ${taskId} not found`,
      data: null,
    };
  }

  async getSingleNotepadTasks(
    notepadId: string,
    params?: TaskQueryParams,
  ): Promise<TasksResponse> {
    if (!this.notepads.some(notepad => notepad._id === notepadId)) {
      return {
        status: 404,
        message: `Notepad ${notepadId} not found`,
        data: [],
      };
    }

    const filteredByNotebook = this.tasks.filter(
      task => task.notepadId === notepadId,
    );

    const filteredTasks = this.applyTaskFilters(filteredByNotebook, params);

    return {
      status: 200,
      message: 'Success',
      data: filteredTasks,
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
      data: [this.notepads[notepadIndex]],
    };
  }

  async updateTask(
    taskId: string,
    updatedTaskFields: Partial<Task>,
  ): Promise<TaskResponse> {
    const taskIndex = this.tasks.findIndex(task => task._id === taskId);
    if (taskIndex === -1) {
      return { status: 404, message: 'Task not found' };
    }

    const currentTask = { ...this.tasks[taskIndex] };
    const newNotepadId = updatedTaskFields.notepadId ?? currentTask.notepadId;

    if (
      !this.isValidNotepadId(newNotepadId) &&
      newNotepadId !== commonNotepadId
    ) {
      return {
        status: 404,
        message: 'Notepad not found',
      };
    }

    if (updatedTaskFields.title) {
      const tasksToCheck =
        newNotepadId === commonNotepadId
          ? this.tasks.filter(task => task.notepadId === commonNotepadId)
          : this.notepads.find(notepad => notepad._id === newNotepadId)
              ?.tasks || [];

      const titleExists = tasksToCheck.some(
        task => task.title === updatedTaskFields.title,
      );

      if (titleExists) {
        return {
          status: 409,
          message: `Task with title ${updatedTaskFields.title} already exists`,
        };
      }
    }

    const subtasks = updatedTaskFields.subtasks ?? currentTask.subtasks;
    const progress = updatedTaskFields.subtasks
      ? this.calculateProgress(subtasks)
      : currentTask.progress;

    const updatedTask = {
      ...currentTask,
      ...updatedTaskFields,
      progress,
      subtasks,
      _id: currentTask._id,
    };

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

      if (targetNotepad) {
        targetNotepad.tasks.push(updatedTask);
      }
    } else if (currentNotepad) {
      const notepadTaskIndex = currentNotepad.tasks.findIndex(
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

    return { status: 200, message: 'Notepad deleted successfully' };
  }

  async deleteTask(taskId: string): Promise<TaskResponse> {
    const taskIndex = this.tasks.findIndex(task => task._id === taskId);

    if (taskIndex === -1) {
      return { status: 404, message: 'Task not found' };
    }

    const taskToDelete = this.tasks[taskIndex];
    const isCommonNotepad = taskToDelete.notepadId === commonNotepadId;

    this.tasks = [
      ...this.tasks.slice(0, taskIndex),
      ...this.tasks.slice(taskIndex + 1),
    ];

    if (!isCommonNotepad) {
      const notepadIndex = this.notepads.findIndex(
        notepad => notepad._id === taskToDelete.notepadId,
      );

      if (notepadIndex !== -1) {
        const notepad = this.notepads[notepadIndex];
        const updatedTasks = notepad.tasks.filter(task => task._id !== taskId);

        this.notepads = [
          ...this.notepads.slice(0, notepadIndex),
          { ...notepad, tasks: updatedTasks },
          ...this.notepads.slice(notepadIndex + 1),
        ];
      }
    }

    return { status: 200, message: 'Task deleted successfully' };
  }
}
export default new MockTaskRepository(NOTEPADS);
