export const ROUTES = {
  NOTEPAD: '/notepads',
  ALL_TASKS: '/notepads/all',
  TODAY_TASKS: '/notepads/today',
  TASK: '/task',
  NOTEPAD_ID: '/notepads/:notepadId',
  TASK_ID: '/notepads/:notepadId/task/:taskId',

  getNotepadPath: (id: string) => `${ROUTES.NOTEPAD}/${id}`,

  getTaskDetailPath: (notepadPath: string, taskId: string) =>
    `${notepadPath}${ROUTES.TASK}/${taskId}`,
} as const;
