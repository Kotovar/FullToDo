export const ROUTES = {
  NOTEPADS: '/notepads',
  TASKS: '/tasks',
  TODAY_TASKS: '/tasks/today',
  NOTEPAD_ID: '/notepads/:notepadId',
  TASK_DETAIL: '/notepads/:notepadId/tasks/:taskId',
  NOTEPAD_TASKS: '/notepads/:notepadId/tasks',

  getNotepadPath: (id: string) => `${ROUTES.NOTEPADS}/${id}/tasks`,

  getTaskDetailPath: (notepadId: string, taskId: string) =>
    `${ROUTES.NOTEPADS}/${notepadId}/tasks/${taskId}`,
} as const;
