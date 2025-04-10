import type {
  CreateTask,
  Task,
  TaskResponse,
  TasksResponse,
} from 'shared/schemas';
import { URL, ERRORS } from '@shared/api';

if (!URL) {
  throw new Error('VITE_URL is not defined in .env file');
}

class TaskService {
  async getSingleTask(
    notepadId: string,
    taskId: string,
  ): Promise<TaskResponse> {
    const response = await fetch(`${URL}/notepad/${notepadId}/task/${taskId}`);

    if (!response.ok) {
      throw new Error(ERRORS.network);
    }

    return response.json();
  }

  async getTasksFromNotepad(taskId: string): Promise<TasksResponse> {
    const response = await fetch(`${URL}/notepad/${taskId}`);

    if (!response.ok) {
      throw new Error(ERRORS.network);
    }

    return response.json();
  }

  async createTask(task: CreateTask, notepadId: string): Promise<TaskResponse> {
    const response = await fetch(`${URL}/notepad/${notepadId}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(ERRORS.network);
    }
    return response.json();
  }

  async updateTask(
    taskId: string,
    notepadId: string,
    updatedTaskFields: Partial<Task>,
  ): Promise<TaskResponse> {
    const response = await fetch(`${URL}/notepad/${notepadId}/task/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTaskFields),
    });
    if (!response.ok) {
      throw new Error(ERRORS.network);
    }
    return response.json();
  }

  async deleteTask(notepadId: string, taskId: string): Promise<TaskResponse> {
    const response = await fetch(`${URL}/notepad/${notepadId}/task/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(ERRORS.network);
    }
    return response.json();
  }
}

export const taskService = new TaskService();
