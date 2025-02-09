import { v4 as uuidv4 } from 'uuid';

import { NOTEPADS } from '../db/mock/mock-db';
import type {
  Task,
  Notepad,
  NotepadWithoutTasks,
  Response,
} from '@shared/types';
import { TaskRepository } from './TaskRepository';

class MockTaskRepository implements TaskRepository {
  private tasks: Task[];
  private notepads: Notepad[];

  constructor(notepads: Notepad[]) {
    this.notepads = notepads;
    this.tasks = notepads.flatMap(notepad => notepad.tasks);
  }

  async getAllNotepads(): Promise<Response<NotepadWithoutTasks[]>> {
    const notepadsWithoutTasks = [
      { name: 'Сегодня', id: 'today' },
      { name: 'Задачи', id: 'all' },
    ].concat(this.notepads.map(({ tasks: _, ...rest }) => rest));

    return {
      status: 200,
      message: 'Success',
      data: notepadsWithoutTasks,
    };
  }

  async getAllTasks(): Promise<Response<Task[]>> {
    return {
      status: 200,
      message: 'Success',
      data: this.tasks,
    };
  }

  async getSingleTask(taskId: string): Promise<Response<Task>> {
    const task = this.tasks.find(task => task.id === taskId);

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
    };
  }

  async getTasksByNotepad(notebookId: string): Promise<Response<Task[]>> {
    if (!this.notepads.some(notepad => notepad.id === notebookId)) {
      return {
        status: 404,
        message: `Notepad ${notebookId} not found`,
        data: [],
      };
    }

    const filteredByNotebook = this.tasks.filter(
      task => task.notebookId === notebookId,
    );

    return {
      status: 200,
      message: 'Success',
      data: filteredByNotebook,
    };
  }

  async getTasksWithDueDate(date: Date): Promise<Response<Task[]>> {
    const filteredDueDate = this.tasks.filter(
      task => task.dueDate?.toDateString() === date.toDateString(),
    );

    return {
      status: 200,
      message: 'Success',
      data: filteredDueDate,
    };
  }

  async createNotepad(title: string): Promise<Response<never>> {
    if (this.notepads.some(notepad => notepad.name === title)) {
      return {
        status: 409,
        message: `A notebook with the title ${title} already exists`,
      };
    }

    this.notepads.push({
      id: String(Number(this.notepads.at(-1)?.id ?? 0) + 1),
      name: title,
      tasks: [],
    });

    return {
      status: 201,
      message: `A notebook with the title ${title} has been successfully created`,
    };
  }

  async createTask(task: Task): Promise<Response<never>> {
    const { title, notebookId, dueDate, description } = task;

    const newTask = {
      title: title,
      id: uuidv4(),
      createdDate: new Date(),
      isCompleted: false,
      notebookId: notebookId,
      dueDate: dueDate,
      description: description,
      subtasks: [],
    };

    this.tasks.push(newTask);
    this.notepads
      .find(notepad => notepad.id === notebookId)
      ?.tasks.push(newTask);

    return {
      status: 201,
      message: `A task with the title ${title} has been successfully created`,
    };
  }

  async deleteTask(taskId: string): Promise<Response<never>> {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return { status: 404, message: 'Task not found' };
    }

    this.tasks.splice(taskIndex, 1);

    return { status: 200, message: 'Task deleted successfully' };
  }

  async updateTask(
    taskId: string,
    updatedTask: Task,
  ): Promise<Response<Task | null>> {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return { status: 404, message: 'Task not found', data: null };
    }

    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };

    return {
      status: 200,
      message: `A task with the id ${taskId} has been successfully updated`,
      data: updatedTask,
    };
  }
}
export default new MockTaskRepository(NOTEPADS);
