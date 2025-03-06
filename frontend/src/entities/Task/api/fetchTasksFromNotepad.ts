import { NotepadResponse } from 'shared/schemas';

export const fetchTasksFromNotepad = async (
  taskId: string,
): Promise<NotepadResponse> => {
  const response = await fetch(`http://localhost:5000/notepad/${taskId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
