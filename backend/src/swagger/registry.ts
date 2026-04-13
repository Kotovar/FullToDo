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
} from '@sharedCommon/schemas';

export const registry = new OpenAPIRegistry();

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

// --- Paths ---

registry.registerPath({
  method: 'get',
  path: '/notepads',
  tags: ['Notepads'],
  summary: 'Get all notepads',
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
  },
});

registry.registerPath({
  method: 'post',
  path: '/notepads',
  tags: ['Notepads'],
  summary: 'Create a notepad',
  request: {
    body: { content: { 'application/json': { schema: CreateNotepadSchema } } },
  },
  responses: {
    201: { description: 'Created' },
    409: { description: 'Notepad with this title already exists' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/notepads/{notepadId}',
  tags: ['Notepads'],
  summary: 'Update a notepad',
  request: {
    params: z.object({ notepadId: z.string() }),
    body: { content: { 'application/json': { schema: CreateNotepadSchema } } },
  },
  responses: {
    200: { description: 'Updated' },
    404: { description: 'Notepad not found' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/notepads/{notepadId}',
  tags: ['Notepads'],
  summary: 'Delete a notepad',
  request: { params: z.object({ notepadId: z.string() }) },
  responses: {
    204: { description: 'Deleted' },
    404: { description: 'Notepad not found' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/tasks',
  tags: ['Tasks'],
  summary: 'Get all tasks',
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
  responses: taskListResponse,
});

registry.registerPath({
  method: 'post',
  path: '/tasks',
  tags: ['Tasks'],
  summary: 'Create a task',
  request: {
    body: { content: { 'application/json': { schema: CreateTaskSchema } } },
  },
  responses: { 201: { description: 'Created' } },
});

registry.registerPath({
  method: 'get',
  path: '/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Get a task by ID',
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
    404: { description: 'Task not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Update a task',
  request: {
    params: z.object({ taskId: z.string() }),
    body: { content: { 'application/json': { schema: UpdateTaskSchema } } },
  },
  responses: {
    200: { description: 'Updated' },
    404: { description: 'Task not found' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Delete a task',
  request: { params: z.object({ taskId: z.string() }) },
  responses: {
    204: { description: 'Deleted' },
    404: { description: 'Task not found' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/notepads/{notepadId}/tasks',
  tags: ['Tasks'],
  summary: 'Get tasks for a notepad',
  request: { params: z.object({ notepadId: z.string() }) },
  responses: { ...taskListResponse, 404: { description: 'Notepad not found' } },
});

registry.registerPath({
  method: 'post',
  path: '/notepads/{notepadId}/tasks',
  tags: ['Tasks'],
  summary: 'Create a task in a notepad',
  request: {
    params: z.object({ notepadId: z.string() }),
    body: { content: { 'application/json': { schema: CreateTaskSchema } } },
  },
  responses: {
    201: { description: 'Created' },
    404: { description: 'Notepad not found' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/notepads/{notepadId}/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Get a task in a notepad',
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
    404: { description: 'Task not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/notepads/{notepadId}/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Update a task in a notepad',
  request: {
    params: z.object({ notepadId: z.string(), taskId: z.string() }),
    body: { content: { 'application/json': { schema: UpdateTaskSchema } } },
  },
  responses: {
    200: { description: 'Updated' },
    404: { description: 'Task not found' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/notepads/{notepadId}/tasks/{taskId}',
  tags: ['Tasks'],
  summary: 'Delete a task in a notepad',
  request: { params: z.object({ notepadId: z.string(), taskId: z.string() }) },
  responses: {
    204: { description: 'Deleted' },
    404: { description: 'Task not found' },
  },
});
