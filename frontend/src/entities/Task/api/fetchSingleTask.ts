import { TaskResponse } from 'shared/schemas';

export const fetchSingleTask = async (
  taskId: string,
  notepadId: string,
): Promise<TaskResponse> => {
  const response = await fetch(
    `http://localhost:5000/notepad/${notepadId}/task/${taskId}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
