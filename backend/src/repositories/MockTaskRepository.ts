import { NOTEPADS } from '../db/mock/mock-db';
import type { Task, Notepad, NotepadNameAndId, Response } from '@shared/types';
import { TaskRepository } from './TaskRepository';

class MockTaskRepository implements TaskRepository {
  private tasks: Task[];
  private notepads: Notepad[];
  private notepadsWithoutTasks: NotepadNameAndId[];

  constructor(notepads: Notepad[]) {
    this.notepads = notepads;
    this.tasks = this.notepads.flatMap(notepad => notepad.tasks);
    this.notepadsWithoutTasks = [
      { name: 'Сегодня', id: 'today' },
      { name: 'Задачи', id: 'all' },
    ].concat(notepads.map(({ tasks: _, createdDate: __, ...rest }) => rest));
  }

  async getAllNotepads(): Promise<Response<NotepadNameAndId[]>> {
    return {
      status: 200,
      message: 'Success',
      data: this.notepadsWithoutTasks,
    };
  }

  async getAllTasks(): Promise<Response<Task[]>> {
    return {
      status: 200,
      message: 'Success',
      data: this.tasks,
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

  async createNotepad(title: string): Promise<Response<Notepad[]>> {
    if (this.notepads.some(notepad => notepad.name === title)) {
      return {
        status: 409,
        message: `A notebook with the title ${title} already exists`,
      };
    }

    this.notepads.push({
      id: '5',
      name: title,
      createdDate: new Date(),
      tasks: [],
    });

    return {
      status: 201,
      message: `A notebook with the title ${title} has been successfully created`,
    };
  }
}
export default new MockTaskRepository(NOTEPADS);
