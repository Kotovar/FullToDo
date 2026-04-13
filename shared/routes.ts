const NOTEPADS_BASE = '/notepads';
const AUTH_BASE = '/auth';

export const ROUTES = {
  NOTEPADS: NOTEPADS_BASE,
  TASKS: '/tasks',
  NOTEPAD_ID: `${NOTEPADS_BASE}/:notepadId`,
  TASK_DETAIL: `${NOTEPADS_BASE}/:notepadId/tasks/:taskId`,
  COMMON_TASK_DETAIL: '/tasks/:taskId',
  NOTEPAD_TASKS: `${NOTEPADS_BASE}/:notepadId/tasks`,

  getNotepadPath: (id: string) => `${NOTEPADS_BASE}/${id}/tasks`,
  getTaskDetailPath: (notepadId: string, taskId: string) =>
    `${NOTEPADS_BASE}/${notepadId}/tasks/${taskId}`,

  AUTH: AUTH_BASE,
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: `${AUTH_BASE}/logout`,
  REFRESH: `${AUTH_BASE}/refresh`,
  AUTH_GOOGLE: `${AUTH_BASE}/google`,
  AUTH_GOOGLE_CALLBACK: `${AUTH_BASE}/google/callback`,
  CHANGE_PASSWORD: '/change-password',
  DELETE_ACCOUNT: '/delete-account',
  VERIFY_EMAIL: '/verify-email',
  RESEND_VERIFICATION: '/resend-verification',
} as const;
