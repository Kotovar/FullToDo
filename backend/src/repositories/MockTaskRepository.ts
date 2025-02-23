import { v4 as uuidv4 } from 'uuid';

import { NOTEPADS } from '../db/mock/mock-db';
import type {
  Task,
  Notepad,
  NotepadWithoutTasks,
  Response,
  CreateNotepad,
} from '@shared/schemas';
import { TaskRepository } from './TaskRepository';

class MockTaskRepository implements TaskRepository {
  private tasks: Task[];
  private notepads: Notepad[];

  constructor(notepads: Notepad[]) {
    this.notepads = notepads;
    this.tasks = notepads.flatMap(notepad => notepad.tasks);
  }

  async createNotepad({ title }: CreateNotepad): Promise<Response<never>> {
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

  async createTask(task: Task, notepadId: string): Promise<Response<never>> {
    const { title, dueDate, description, subtasks = [] } = task;

    const newTask = {
      title: title,
      _id: uuidv4(),
      createdDate: new Date(),
      isCompleted: false,
      notepadId: notepadId,
      dueDate: dueDate,
      description: description,
      subtasks: subtasks,
    };

    this.tasks.push(newTask);
    this.notepads
      .find(notepad => notepad._id === notepadId)
      ?.tasks.push(newTask);

    return {
      status: 201,
      message: `A task with the title ${title} has been successfully created`,
    };
  }

  async getAllNotepads(): Promise<Response<NotepadWithoutTasks[]>> {
    const notepadsWithoutTasks = [
      { title: 'Сегодня', _id: 'today' },
      { title: 'Задачи', _id: 'all' },
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

  async getSingleTask(
    taskId: string,
    notepadId: string,
  ): Promise<Response<Task>> {
    const task = this.tasks.find(
      task => task._id === taskId && task.notepadId === notepadId,
    );

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

  async getTasksByNotepad(notepadId: string): Promise<Response<Task[]>> {
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

  async updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<Notepad>,
  ): Promise<Response<Notepad | null>> {
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

    const notepadIndex = this.notepads.findIndex(
      notepad => notepad._id === notepadId,
    );

    if (notepadIndex === -1) {
      return { status: 404, message: 'Notepad not found', data: null };
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
    notepadId: string,
    updatedTaskFields: Partial<Task>,
  ): Promise<Response<Task | null>> {
    const taskIndex = this.tasks.findIndex(
      task => task._id === taskId && task.notepadId === notepadId,
    );

    if (taskIndex === -1) {
      return { status: 404, message: 'Task not found', data: null };
    }

    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTaskFields };

    return {
      status: 200,
      message: `A task with the _id ${taskId} has been successfully updated`,
      data: this.tasks[taskIndex],
    };
  }

  async deleteNotepad(notepadId: string): Promise<Response<never>> {
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

  async deleteTask(taskId: string): Promise<Response<never>> {
    const taskIndex = this.tasks.findIndex(task => task._id === taskId);

    if (taskIndex === -1) {
      return { status: 404, message: 'Task not found' };
    }

    this.tasks.splice(taskIndex, 1);

    return { status: 200, message: 'Task deleted successfully' };
  }
}
export default new MockTaskRepository(NOTEPADS);
