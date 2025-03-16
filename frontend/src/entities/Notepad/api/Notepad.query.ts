import { NotepadWithoutTasksResponse, NotepadResponse } from 'shared/schemas';

if (!process.env.VITE_URL) {
  throw new Error('VITE_URL is not defined in .env file');
}

const URL = process.env.VITE_URL;

class NotepadService {
  async getNotepads(): Promise<NotepadWithoutTasksResponse> {
    const response = await fetch(`${URL}/notepad`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
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
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
}

export const notepadService = new NotepadService();
