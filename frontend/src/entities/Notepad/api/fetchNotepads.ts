import { NotepadWithoutTasksResponse } from 'shared/schemas';

export const fetchNotepads = async (): Promise<NotepadWithoutTasksResponse> => {
  const response = await fetch('http://localhost:5000/notepad');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
