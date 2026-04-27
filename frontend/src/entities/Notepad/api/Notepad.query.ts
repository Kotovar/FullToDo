import {
  URL,
  COMMON_ERRORS,
  NOTEPAD_ERRORS,
  HEADERS,
  BaseService,
  authFetch,
} from '@shared/api';
import { ROUTES } from 'shared/routes';
import type {
  NotepadWithoutTasksResponse,
  NotepadResponse,
  CreateNotepad,
} from 'shared/schemas';

if (!URL) {
  throw new Error(COMMON_ERRORS.URL.message);
}

const notepadRoutes = {
  all: `${URL}${ROUTES.notepads.base}`,
  single: (notepadId: string) => `${URL}${ROUTES.notepads.base}/${notepadId}`,
};

export const getNotepadsQueryKey = (userScope: number | 'guest') =>
  ['notepads', userScope] as const;

export class NotepadService extends BaseService {
  protected async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) return response.json();

    switch (response.status) {
      case 409:
        throw new Error('Conflict', { cause: NOTEPAD_ERRORS.CONFLICT });
      case 404:
        throw new Error('Not found', { cause: NOTEPAD_ERRORS.UNDEFINED });
      default:
        throw new Error('Server error', { cause: NOTEPAD_ERRORS.SERVER_ERROR });
    }
  }

  protected async handleError(error: unknown): Promise<never> {
    if (error instanceof Error && error.cause) {
      throw error;
    }

    throw new Error('Network error', { cause: NOTEPAD_ERRORS.NETWORK_ERROR });
  }

  async getNotepads(): Promise<NotepadWithoutTasksResponse> {
    try {
      const response = await authFetch(notepadRoutes.all);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createNotepad(title: string): Promise<NotepadResponse> {
    try {
      const response = await authFetch(notepadRoutes.all, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ title }),
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<CreateNotepad>,
  ): Promise<NotepadResponse> {
    try {
      const response = await authFetch(notepadRoutes.single(notepadId), {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify(updatedNotepadFields),
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteNotepad(notepadId: string): Promise<NotepadResponse> {
    try {
      const response = await authFetch(notepadRoutes.single(notepadId), {
        method: 'DELETE',
        headers: HEADERS,
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const notepadService = new NotepadService();
