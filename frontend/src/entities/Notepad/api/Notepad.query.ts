import {
  NotepadWithoutTasksResponse,
  NotepadResponse,
  CreateNotepad,
} from 'shared/schemas';
import { URL, ERRORS } from '@shared/api';

if (!URL) {
  throw new Error(ERRORS.url);
}

export class NotepadService {
  async getNotepads(): Promise<NotepadWithoutTasksResponse> {
    const response = await fetch(`${URL}/notepad`);
    if (!response.ok) {
      throw new Error(ERRORS.network);
    }
    return response.json();
  }

  async createNotepad(title: string): Promise<NotepadResponse> {
    const response = await fetch(`${URL}/notepad`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: title }),
    });
    if (!response.ok) {
      throw new Error(ERRORS.network);
    }
    return response.json();
  }

  async updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<CreateNotepad>,
  ) {
    const response = await fetch(`${URL}/notepad/${notepadId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNotepadFields),
    });
    if (!response.ok) {
      throw new Error(ERRORS.network);
    }
    return response.json();
  }

  async deleteNotepad(notepadId: string): Promise<NotepadResponse> {
    const response = await fetch(`${URL}/notepad/${notepadId}`, {
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

export const notepadService = new NotepadService();
