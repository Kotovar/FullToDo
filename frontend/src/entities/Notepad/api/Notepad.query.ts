import {
  URL,
  COMMON_ERRORS,
  NOTEPAD_ERRORS,
  HEADERS,
  BaseService,
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
  all: `${URL}${ROUTES.NOTEPADS}`,
  single: (notepadId: string) => `${URL}${ROUTES.NOTEPADS}/${notepadId}`,
};

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
      const response = await fetch(notepadRoutes.all);
      return response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createNotepad(title: string): Promise<NotepadResponse> {
    try {
      const response = await fetch(notepadRoutes.all, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ title: title }),
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
      const response = await fetch(notepadRoutes.single(notepadId), {
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
      const response = await fetch(notepadRoutes.single(notepadId), {
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
