import { ROUTES } from 'shared/routes';
import {
  URL,
  TASKS_ERRORS,
  COMMON_ERRORS,
  HEADERS,
  BaseService,
} from '@shared/api';
import {
  CreateTask,
  Task,
  TaskResponse,
  TasksResponse,
  commonNotepadId,
} from 'shared/schemas';

if (!URL) {
  throw new Error(COMMON_ERRORS.URL.message);
}

const taskRoutes = {
  all: `${URL}${ROUTES.TASKS}`,
  single: (notepadId: string, taskId: string) =>
    `${URL}${ROUTES.getTaskDetailPath(notepadId, taskId)}`,
  singleInCommonNotepad: (taskId: string) => `${URL}${ROUTES.TASKS}/${taskId}`,
  forCreate: (notepadId: string) => `${URL}${ROUTES.getNotepadPath(notepadId)}`,
  forCreateInCommonNotepad: `${URL}${ROUTES.TASKS}`,
};

class TaskService extends BaseService {
  protected async handleResponse<T>(response: Response): Promise<T> {
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

  protected async handleError(error: unknown): Promise<never> {
    if (error instanceof Error && error.cause) {
      throw error;
    }

    throw new Error('Network error', { cause: TASKS_ERRORS.NETWORK_ERROR });
  }

  protected buildQueryString(params?: URLSearchParams): string {
    const queryString = params?.toString();
    return queryString ? `?${queryString}` : '';
  }

  async getSingleTask(
    taskId: string,
    notepadId?: string,
  ): Promise<TaskResponse> {
    try {
      const response = await fetch(
        notepadId
          ? taskRoutes.single(notepadId, taskId)
          : taskRoutes.singleInCommonNotepad(taskId),
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
      const response = await fetch(
        `${URL}${endpoint}${this.buildQueryString(params)}`,
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAllTasks(params: URLSearchParams): Promise<TasksResponse> {
    try {
      const response = await fetch(
        `${taskRoutes.all}${this.buildQueryString(params)}`,
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
        ? taskRoutes.forCreate(notepadId)
        : taskRoutes.forCreateInCommonNotepad;

      const response = await fetch(patch, {
        method: 'POST',
        headers: HEADERS,
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
      const response = await fetch(taskRoutes.singleInCommonNotepad(taskId), {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify(updatedTaskFields),
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteTask(taskId: string): Promise<TaskResponse> {
    try {
      const response = await fetch(taskRoutes.singleInCommonNotepad(taskId), {
        method: 'DELETE',
        headers: HEADERS,
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const taskService = new TaskService();
