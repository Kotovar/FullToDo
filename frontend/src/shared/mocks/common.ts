export const getDeleteResponse = (entity: 'Notepad' | 'Task') => {
  return { status: 200, message: `${entity} deleted successfully` };
};

export const notepadId = '1';
export const taskId = '1';
