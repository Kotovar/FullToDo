import { URL, TASKS_ERRORS, COMMON_ERRORS } from '@shared/api';
import { ROUTES } from 'shared/routes';
import { commonNotepadId } from 'shared/schemas';
import type {
  CreateTask,
  Task,
  TaskResponse,
  TasksResponse,
} from 'shared/schemas';

if (!URL) {
  throw new Error(COMMON_ERRORS.URL.message);
}

class TaskService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) return response.json();

    switch (response.status) {
      case 409:
        throw new Error('Conflict', {
          cause: TASKS_ERRORS.CONFLICT,
        });
      case 404:
        throw new Error('Not found', {
          cause: TASKS_ERRORS.UNDEFINED,
        });
      default:
        throw new Error('Server error', {
          cause: TASKS_ERRORS.SERVER_ERROR,
        });
    }
  }

  private async handleError(error: unknown): Promise<never> {
    if (error instanceof Error && error.cause) {
      throw error;
    }

    throw new Error('Network error', {
      cause: TASKS_ERRORS.NETWORK_ERROR,
    });
  }

  async getSingleTask(
    taskId: string,
    notepadId?: string,
  ): Promise<TaskResponse> {
    try {
      const response = await fetch(
        notepadId
          ? `${URL}${ROUTES.getTaskDetailPath(notepadId, taskId)}`
          : `${URL}${ROUTES.TASKS}/${taskId}`,
      );

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getTasksFromNotepad(
    notepadId: string,
    params: URLSearchParams,
  ): Promise<TasksResponse> {
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
      const queryString = params.toString();

      const response = await fetch(
        `${URL}${endpoint}${queryString ? `?${queryString}` : ''}`,
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAllTasks(params: URLSearchParams): Promise<TasksResponse> {
    try {
      const queryString = params.toString();

      const response = await fetch(
        `${URL}${ROUTES.TASKS}${queryString ? `?${queryString}` : ''}`,
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createTask(
    task: CreateTask,
    notepadId?: string,
  ): Promise<TaskResponse> {
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
