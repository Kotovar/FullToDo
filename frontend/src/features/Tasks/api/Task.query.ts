import type { CreateTask, TaskResponse, TasksResponse } from 'shared/schemas';

if (!process.env.VITE_URL) {
  throw new Error('VITE_URL is not defined in .env file');
}

const URL = process.env.VITE_URL;

class TaskService {
  async getSingleTask(
    notepadId: string,
    taskId: string,
  ): Promise<TaskResponse> {
    const response = await fetch(`${URL}/notepad/${notepadId}/task/${taskId}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  async getTasksFromNotepad(taskId: string): Promise<TasksResponse> {
    const response = await fetch(`${URL}/notepad/${taskId}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
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
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
}

export const taskService = new TaskService();
