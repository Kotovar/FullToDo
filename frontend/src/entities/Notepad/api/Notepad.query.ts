import {
  NotepadWithoutTasksResponse,
  NotepadResponse,
  CreateNotepad,
} from 'shared/schemas';
import { URL, COMMON_ERRORS, NOTEPAD_ERRORS } from '@shared/api';
import { ROUTES } from 'shared/routes';

if (!URL) {
  throw new Error(COMMON_ERRORS.URL.message);
}

export class NotepadService {
  private async handleResponse<T>(response: Response): Promise<T> {
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

  private async handleError(error: unknown): Promise<never> {
    if (error instanceof Error && error.cause) {
      throw error;
    }
    throw new Error('Network error', { cause: NOTEPAD_ERRORS.NETWORK_ERROR });
  }

  async getNotepads(): Promise<NotepadWithoutTasksResponse> {
    try {
      const response = await fetch(`${URL}${ROUTES.NOTEPADS}`);
      return response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createNotepad(title: string): Promise<NotepadResponse> {
    try {
      const response = await fetch(`${URL}${ROUTES.NOTEPADS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`${URL}${ROUTES.NOTEPADS}/${notepadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNotepadFields),
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteNotepad(notepadId: string): Promise<NotepadResponse> {
    try {
      const response = await fetch(`${URL}${ROUTES.NOTEPADS}/${notepadId}`, {
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

export const notepadService = new NotepadService();
