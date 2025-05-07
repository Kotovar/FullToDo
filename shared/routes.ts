export const ROUTES = {
  NOTEPAD: '/notepad',
  ALL_TASKS: '/notepad/all',
  TODAY_TASKS: '/notepad/today',
  TASK: '/task',
  NOTEPAD_ID: '/notepad/:notepadId',
  TASK_ID: '/notepad/:notepadId/task/:taskId',

  getNotepadPath: (id: string) => `${ROUTES.NOTEPAD}/${id}`,

  getTaskDetailPath: (notepadPath: string, taskId: string) =>
    `${notepadPath}${ROUTES.TASK}/${taskId}`,
} as const;
