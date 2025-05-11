import {
  commonNotepadId,
  type CreateTask,
  type Task,
  type TaskResponse,
  type TasksResponse,
} from 'shared/schemas';
import { URL, TASKS_ERRORS, COMMON_ERRORS } from '@shared/api';
import { ROUTES } from 'shared/routes';

if (!URL) {
  throw new Error(COMMON_ERRORS.URL.message);
}

class TaskService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) return response.json();

    switch (response.status) {
      case 409:
        throw new Error('Conflict', { cause: TASKS_ERRORS.CONFLICT });
      case 404:
        throw new Error('Not found', { cause: TASKS_ERRORS.UNDEFINED });
      default:
        throw new Error('Server error', { cause: TASKS_ERRORS.SERVER_ERROR });
    }
  }

  private async handleError(error: unknown): Promise<never> {
    if (error instanceof Error && error.cause) {
      throw error;
    }
    throw new Error('Network error', { cause: TASKS_ERRORS.NETWORK_ERROR });
  }

  async getSingleTask(
    taskId: string,
    notepadId: string,
  ): Promise<TaskResponse> {
    try {
      if (notepadId) {
        const response = await fetch(
          `${URL}${ROUTES.getTaskDetailPath(notepadId, taskId)}`,
        );
        return response.json();
      }
      const response = await fetch(`${URL}${ROUTES.TASKS}/${taskId}`);
      return response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getTasksFromNotepad(notepadId: string): Promise<TasksResponse> {
    try {
      let endpoint: string;

      switch (notepadId) {
        case commonNotepadId:
        case '':
          endpoint = ROUTES.TASKS;
          break;
        default:
          endpoint = ROUTES.getNotepadPath(notepadId);
      }

      const response = await fetch(`${URL}${endpoint}`);
      return response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAllTasks(): Promise<TasksResponse> {
    try {
      const response = await fetch(`${URL}${ROUTES.TASKS}`);
      return response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createTask(task: CreateTask, notepadId: string): Promise<TaskResponse> {
    try {
      const patch = notepadId
        ? `${URL}${ROUTES.getNotepadPath(notepadId)}`
        : `${URL}${ROUTES.TASKS}`;

      const response = await fetch(patch, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateTask(
    taskId: string,
    updatedTaskFields: Partial<Task>,
  ): Promise<TaskResponse> {
    try {
      const response = await fetch(`${URL}${ROUTES.TASKS}/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTaskFields),
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteTask(taskId: string): Promise<TaskResponse> {
    try {
      const response = await fetch(`${URL}${ROUTES.TASKS}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const taskService = new TaskService();
