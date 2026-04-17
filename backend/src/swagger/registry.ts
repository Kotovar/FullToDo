import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  createNotepadSchema,
  createTaskSchema,
  updateTaskSchema,
  dbTaskSchema,
  dbNotepadSchema,
  createSubtaskSchema,
  paginationMetaSchema,
  registerWithEmailSchema,
  loginWithEmailSchema,
  loginWithGoogleSchema,
  changePasswordSchema,
  deleteUserSchema,
  resendVerificationSchema,
  publicUserSchema,
} from '@sharedCommon/schemas';

export const registry = new OpenAPIRegistry();

// --- Security scheme ---

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

const bearerAuth = [{ bearerAuth: [] }];

// --- Schemas ---

registry.register(
  'Subtask',
  createSubtaskSchema.openapi({ description: 'Subtask' }),
);

const TaskSchema = registry.register(
  'Task',
  dbTaskSchema.openapi({ description: 'Task' }),
);

registry.register(
  'Notepad',
  dbNotepadSchema.openapi({ description: 'Notepad' }),
);

const PublicUserSchema = registry.register(
  'PublicUser',
  publicUserSchema.openapi({
    description: 'Public user (without sensitive fields)',
  }),
);

const CreateNotepadSchema = registry.register(
  'CreateNotepad',
  createNotepadSchema.openapi({ description: 'Create notepad payload' }),
);

const CreateTaskSchema = registry.register(
  'CreateTask',
  createTaskSchema.openapi({ description: 'Create task payload' }),
);

const UpdateTaskSchema = registry.register(
  'UpdateTask',
  updateTaskSchema.openapi({ description: 'Update task payload' }),
);

const PaginationMetaSchema = registry.register(
  'PaginationMeta',
  paginationMetaSchema.openapi({ description: 'Pagination metadata' }),
);

const RegisterSchema = registry.register(
  'RegisterWithEmail',
  registerWithEmailSchema.openapi({
    description: 'Register with email payload',
  }),
);

const LoginEmailSchema = registry.register(
  'LoginWithEmail',
  loginWithEmailSchema.openapi({ description: 'Login with email payload' }),
);

const LoginGoogleSchema = registry.register(
  'LoginWithGoogle',
  loginWithGoogleSchema.openapi({ description: 'Login with Google payload' }),
);

const ChangePasswordSchema = registry.register(
  'ChangePassword',
  changePasswordSchema.openapi({ description: 'Change password payload' }),
);

const DeleteUserSchema = registry.register(
  'DeleteUser',
  deleteUserSchema.openapi({ description: 'Delete user payload' }),
);

const ResendVerificationSchema = registry.register(
  'ResendVerification',
  resendVerificationSchema.openapi({
    description: 'Resend verification payload',
  }),
);

// --- Helpers ---

const taskListResponse = {
  200: {
    description: 'Paginated list of tasks',
    content: {
      'application/json': {
        schema: z.object({
          status: z.number(),
          message: z.string(),
          data: z.array(TaskSchema),
          meta: PaginationMetaSchema,
        }),
      },
    },
  },
};

const unauthorizedResponse = { 401: { description: 'Unauthorized' } };
const forbiddenResponse = { 403: { description: 'Forbidden' } };
const notFoundResponse = { 404: { description: 'Not found' } };
const validationResponse = { 422: { description: 'Validation error' } };

// --- Auth routes ---

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  summary: 'Register with email',
  request: {
    body: { content: { 'application/json': { schema: RegisterSchema } } },
  },
  responses: {
    201: {
      description: 'User created. Verification email sent.',
      content: {
        'application/json': {
          schema: z.object({ message: z.string(), user: PublicUserSchema }),
        },
      },
    },
    409: { description: 'Email already registered' },
    ...validationResponse,
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Login with email',
  request: {
    body: { content: { 'application/json': { schema: LoginEmailSchema } } },
  },
  responses: {
    200: {
      description:
        'Access token returned. Refresh token set as HttpOnly cookie.',
      content: {
        'application/json': {
          schema: z.object({ message: z.string(), accessToken: z.string() }),
        },
      },
    },
    401: { description: 'Invalid credentials or email not verified' },
    404: { description: 'User not found' },
    ...validationResponse,
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/google',
  tags: ['Auth'],
  summary: 'Register or login with Google',
  request: {
    body: { content: { 'application/json': { schema: LoginGoogleSchema } } },
  },
  responses: {
    200: {
      description:
        'Access token returned. Refresh token set as HttpOnly cookie.',
      content: {
        'application/json': {
          schema: z.object({ message: z.string(), accessToken: z.string() }),
        },
      },
    },
    409: { description: 'Email already registered with another method' },
    ...validationResponse,
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/refresh',
  tags: ['Auth'],
  summary: 'Refresh access token',
  description:
    'Requires refresh token in HttpOnly cookie. Rotates refresh token.',
  responses: {
    200: {
      description:
        'New access token returned. New refresh token set as HttpOnly cookie.',
      content: {
        'application/json': {
          schema: z.object({ message: z.string(), accessToken: z.string() }),
        },
      },
    },
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/me',
  tags: ['Auth'],
  summary: 'Get current user',
  security: bearerAuth,
  responses: {
    200: {
      description: 'Current authenticated user',
      content: {
        'application/json': {
          schema: z.object({ user: PublicUserSchema }),
        },
      },
    },
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  tags: ['Auth'],
  summary: 'Logout',
  description: 'Deletes refresh token from DB and clears cookie.',
  responses: {
    200: {
      description: 'Logged out',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/verify-email',
  tags: ['Auth'],
  summary: 'Verify email',
  request: {
    query: z.object({ token: z.string() }),
  },
  responses: {
    200: { description: 'Email verified' },
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/resend-verification',
  tags: ['Auth'],
  summary: 'Resend verification email',
  request: {
    body: {
      content: { 'application/json': { schema: ResendVerificationSchema } },
    },
  },
  responses: {
    200: {
      description:
        'Verification email sent (if user exists and is not verified)',
    },
    ...validationResponse,
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/change-password',
  tags: ['Auth'],
  summary: 'Change password',
  security: bearerAuth,
  request: {
    body: { content: { 'application/json': { schema: ChangePasswordSchema } } },
  },
  responses: {
    200: { description: 'Password changed. All sessions invalidated.' },
    ...unauthorizedResponse,
    ...validationResponse,
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/delete-user',
  tags: ['Auth'],
  summary: 'Delete account',
  security: bearerAuth,
  request: {
    body: { content: { 'application/json': { schema: DeleteUserSchema } } },
  },
  responses: {
    200: { description: 'Account deleted' },
    ...unauthorizedResponse,
    ...validationResponse,
  },
});

// --- Notepad routes ---

registry.registerPath({
  method: 'get',
  path: '/notepads',
  tags: ['Notepads'],
  summary: 'Get all notepads',
  security: bearerAuth,
  responses: {
    200: {
      description: 'List of notepads',
      content: {
        'application/json': {
          schema: z.object({
            status: z.number(),
            message: z.string(),
            data: z.array(z.object({ _id: z.string(), title: z.string() })),
          }),
        },
      },
    },
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  method: 'post',
  path: '/notepads',
  tags: ['Notepads'],
  summary: 'Create a notepad',
  security: bearerAuth,
  request: {
    body: { content: { 'application/json': { schema: CreateNotepadSchema } } },
  },
  responses: {
    201: { description: 'Created' },
    409: { description: 'Notepad with this title already exists' },
    ...unauthorizedResponse,
    ...validationResponse,
  },
});

registry.registerPath({
  method: 'patch',
  path: '/notepads/{notepadId}',
  tags: ['Notepads'],
  summary: 'Update a notepad',
  security: bearerAuth,
  request: {
    params: z.object({ notepadId: z.string() }),
    body: { content: { 'application/json': { schema: CreateNotepadSchema } } },
  },
  responses: {
    200: { description: 'Updated' },
    ...unauthorizedResponse,
    ...forbiddenResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/notepads/{notepadId}',
  tags: ['Notepads'],
  summary: 'Delete a notepad',
  security: bearerAuth,
  request: { params: z.object({ notepadId: z.string() }) },
  responses: {
    204: { description: 'Deleted' },
    ...unauthorizedResponse,
    ...forbiddenResponse,
    ...notFoundResponse,
  },
});

// --- Task routes ---

registry.registerPath({
  method: 'get',
  path: '/tasks',
  tags: ['Tasks'],
  summary: 'Get all tasks',
  security: bearerAuth,
  request: {
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      sortBy: z.enum(['createdDate', 'dueDate']).optional(),
      order: z.enum(['asc', 'desc']).optional(),
      search: z.string().optional(),
      isCompleted: z.enum(['true', 'false']).optional(),
      hasDueDate: z.enum(['true', 'false']).optional(),
    }),
  },
  responses: {
    ...taskListResponse,
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  method: 'post',
  path: '/tasks',
  tags: ['Tasks'],
  summary: 'Create a task',
  security: bearerAuth,
  request: {
    body: { content: { 'application/json': { schema: CreateTaskSchema } } },
  },
  responses: {
    201: { description: 'Created' },
    ...unauthorizedResponse,
    ...validationResponse,
  },
});

registry.registerPath({
  method: 'get',
  path: '/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Get a task by ID',
  security: bearerAuth,
  request: { params: z.object({ taskId: z.string() }) },
  responses: {
    200: {
      description: 'Task',
      content: {
        'application/json': {
          schema: z.object({
            status: z.number(),
            message: z.string(),
            data: TaskSchema,
          }),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  method: 'patch',
  path: '/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Update a task',
  security: bearerAuth,
  request: {
    params: z.object({ taskId: z.string() }),
    body: { content: { 'application/json': { schema: UpdateTaskSchema } } },
  },
  responses: {
    200: { description: 'Updated' },
    ...unauthorizedResponse,
    ...forbiddenResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Delete a task',
  security: bearerAuth,
  request: { params: z.object({ taskId: z.string() }) },
  responses: {
    204: { description: 'Deleted' },
    ...unauthorizedResponse,
    ...forbiddenResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  method: 'get',
  path: '/notepads/{notepadId}/tasks',
  tags: ['Tasks'],
  summary: 'Get tasks for a notepad',
  security: bearerAuth,
  request: { params: z.object({ notepadId: z.string() }) },
  responses: {
    ...taskListResponse,
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  method: 'post',
  path: '/notepads/{notepadId}/tasks',
  tags: ['Tasks'],
  summary: 'Create a task in a notepad',
  security: bearerAuth,
  request: {
    params: z.object({ notepadId: z.string() }),
    body: { content: { 'application/json': { schema: CreateTaskSchema } } },
  },
  responses: {
    201: { description: 'Created' },
    ...unauthorizedResponse,
    ...notFoundResponse,
    ...validationResponse,
  },
});

registry.registerPath({
  method: 'get',
  path: '/notepads/{notepadId}/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Get a task in a notepad',
  security: bearerAuth,
  request: { params: z.object({ notepadId: z.string(), taskId: z.string() }) },
  responses: {
    200: {
      description: 'Task',
      content: {
        'application/json': {
          schema: z.object({
            status: z.number(),
            message: z.string(),
            data: TaskSchema,
          }),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  method: 'patch',
  path: '/notepads/{notepadId}/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Update a task in a notepad',
  security: bearerAuth,
  request: {
    params: z.object({ notepadId: z.string(), taskId: z.string() }),
    body: { content: { 'application/json': { schema: UpdateTaskSchema } } },
  },
  responses: {
    200: { description: 'Updated' },
    ...unauthorizedResponse,
    ...forbiddenResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/notepads/{notepadId}/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Delete a task in a notepad',
  security: bearerAuth,
  request: { params: z.object({ notepadId: z.string(), taskId: z.string() }) },
  responses: {
    204: { description: 'Deleted' },
    ...unauthorizedResponse,
    ...forbiddenResponse,
    ...notFoundResponse,
  },
});
