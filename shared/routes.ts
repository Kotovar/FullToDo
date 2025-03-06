export const ROUTES = {
  NOTEPADS: '/notepad',
  ALL_TASKS: '/notepad/all',
  TODAY_TASKS: '/notepad/today',
  TASK: '/task',
  NOTEPAD_ID: '/notepad/:notepadId',
  TASK_ID: '/notepad/:notepadId/task/:taskId',

  getNotepadPath: (id: string) => `${ROUTES.NOTEPADS}/${id}`,

  getTaskDetailPath: (notepadPath: string, taskId: string) =>
    `${notepadPath}${ROUTES.TASK}/${taskId}`,
};
