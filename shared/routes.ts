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
    register: '/register',
    login: '/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    google: '/auth/google',
    googleCallback: '/auth/google/callback',
    changePassword: '/change-password',
    deleteAccount: '/delete-account',
    verifyEmail: '/verify-email',
    resendVerification: '/resend-verification',
  },
} as const;
