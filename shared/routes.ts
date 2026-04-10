export const ROUTES = {
  NOTEPADS: '/notepads',
  TASKS: '/tasks',
  NOTEPAD_ID: '/notepads/:notepadId',
  TASK_DETAIL: '/notepads/:notepadId/tasks/:taskId',
  COMMON_TASK_DETAIL: '/tasks/:taskId',
  NOTEPAD_TASKS: '/notepads/:notepadId/tasks',

  getNotepadPath: (id: string) => `${ROUTES.NOTEPADS}/${id}/tasks`,
  getTaskDetailPath: (notepadId: string, taskId: string) =>
    `${ROUTES.NOTEPADS}/${notepadId}/tasks/${taskId}`,

  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  AUTH_GOOGLE: '/auth/google',
  AUTH_GOOGLE_CALLBACK: '/auth/google/callback',
  CHANGE_PASSWORD: '/change-password',
  DELETE_ACCOUNT: '/delete-account',
  VERIFY_EMAIL: '/verify-email',
  RESEND_VERIFICATION: '/resend-verification',
} as const;
