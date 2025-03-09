import { NotepadWithoutTasksResponse } from 'shared/schemas';

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
}

export const notepadService = new NotepadService();
