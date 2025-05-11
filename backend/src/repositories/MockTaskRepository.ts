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

    const isTitleUnique = !this.tasks.some(
      task => task.title === title && task.notepadId === notepadId,
    );

    if (!isTitleUnique) {
      const notepadTitle =
        notepadId === commonNotepadId
          ? 'All tasks'
          : (this.notepads.find(notepad => notepad._id === notepadId)?.title ??
            'Unknown');

      return {
        status: 409,
        message: `Task with title "${title}" already exists in ${notepadTitle}`,
      };
    }

    const newTask = {
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

  async getAllTasks(): Promise<TasksResponse> {
    return {
      status: 200,
      message: 'Success',
      data: this.tasks,
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

  async getSingleNotepadTasks(notepadId: string): Promise<TasksResponse> {
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

    return {
      status: 200,
      message: 'Success',
      data: filteredByNotebook,
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

    const currentNotepad =
      currentTask.notepadId !== commonNotepadId
        ? this.notepads.find(notepad => notepad._id === currentTask.notepadId)
        : null;

    if (!currentNotepad && currentTask.notepadId !== commonNotepadId) {
      return {
        status: 404,
        message: 'Notepad not found',
      };
    }

    if (
      updatedTaskFields.title &&
      updatedTaskFields.title !== currentTask.title
    ) {
      const tasksToCheck =
        currentTask.notepadId === commonNotepadId
          ? this.tasks.filter(
              task => task.notepadId === commonNotepadId && task._id !== taskId,
            )
          : currentNotepad?.tasks?.filter(task => task._id !== taskId) || [];

      const titleExists = tasksToCheck.some(
        task => task.title === updatedTaskFields.title,
      );

      if (titleExists) {
        return {
          status: 409,
          message: `Task with title "${updatedTaskFields.title}" already exists`,
        };
      }
    }

    const subtasks = updatedTaskFields.subtasks ?? currentTask.subtasks;
    const progress = this.calculateProgress(subtasks);

    const updatedTask = {
      ...currentTask,
      ...updatedTaskFields,
      progress,
      subtasks,
    };

    this.tasks = [
      ...this.tasks.slice(0, taskIndex),
      updatedTask,
      ...this.tasks.slice(taskIndex + 1),
    ];

    if (currentNotepad) {
      const notepadTaskIndex = currentNotepad.tasks.findIndex(
        task => task._id === taskId,
      );

      if (notepadTaskIndex !== -1) {
        currentNotepad.tasks = [
          ...currentNotepad.tasks.slice(0, notepadTaskIndex),
          updatedTask,
          ...currentNotepad.tasks.slice(notepadTaskIndex + 1),
        ];
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

    if (notepadIndex === -1) {
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
