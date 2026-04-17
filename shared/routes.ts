export const ROUTES = {
  notepads: {
    base: '/notepads',
    byId: '/notepads/:notepadId',
    tasks: '/notepads/:notepadId/tasks',
    taskDetail: '/notepads/:notepadId/tasks/:taskId',
    getPath: (id: string) => `/notepads/${id}/tasks`,
    getTaskPath: (notepadId: string, taskId: string) =>
      `/notepads/${notepadId}/tasks/${taskId}`,
  },
  tasks: {
    base: '/tasks',
    byId: '/tasks/:taskId',
  },
  auth: {
    base: '/auth',
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    google: '/auth/google',
    changePassword: '/auth/change-password',
    deleteUser: '/auth/delete-user',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
  },
} as const;
