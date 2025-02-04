import { NOTEPADS } from '../db/mock/mock-db';
import type { Task, Notepad } from '../models/Task';
import { Response, TaskRepository } from './TaskRepository';

class MockTaskRepository implements TaskRepository {
  private tasks: Task[];
  private notepads: Notepad[];

  constructor(notepads: Notepad[]) {
    this.notepads = notepads;
    this.tasks = this.notepads.flatMap(notepad => notepad.tasks);
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
        message: 'Error 404',
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
}
export default new MockTaskRepository(NOTEPADS);
