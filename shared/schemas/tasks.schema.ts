import { z } from 'zod';
import { PAGINATION } from './consts';

const PriorityEnum = z.enum(['low', 'medium', 'high']);
const StatusResponseEnum = z.union([
  z.literal(200),
  z.literal(201),
  z.literal(204),
  z.literal(404),
  z.literal(409),
  z.literal(500),
]);

type StatusResponseEnum = z.infer<typeof StatusResponseEnum>;

const zPage = () =>
  z
    .string()
    .optional()
    .transform(val => parseInt(val ?? PAGINATION.DEFAULT_PAGE.toString()))
    .refine(val => val > 0, { message: 'Page must be positive' });

const zLimit = () =>
  z
    .string()
    .optional()
    .transform(val => parseInt(val ?? PAGINATION.DEFAULT_LIMIT.toString()))
    .refine(val => val > 0, { message: 'Limit must be positive' });

export type PriorityEnum = z.infer<typeof PriorityEnum>;

export const createNotepadSchema = z.object({
  title: z.coerce.string().min(1, 'Title is required'),
});

export const createSubtaskSchema = z.object({
  title: z.coerce.string().min(1, 'Title is required'),
  isCompleted: z.boolean().optional().default(false),
  _id: z.string(),
});

export const createTaskSchema = z.object({
  title: z.coerce.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.coerce.date().nullable().optional(),
  priority: PriorityEnum.optional(),
});

export const dbTaskSchema = createTaskSchema.extend({
  createdDate: z.coerce.date(),
  notepadId: z.string(),
  _id: z.string(),
  progress: z.string(),
  isCompleted: z.boolean().default(false),
  subtasks: z.array(createSubtaskSchema).optional(),
});

export const dbNotepadSchema = createNotepadSchema.extend({
  tasks: z.array(dbTaskSchema),
  _id: z.string(),
});

const notepadWithoutTasksSchema = dbNotepadSchema.pick({
  _id: true,
  title: true,
});

export const updateTaskSchema = createTaskSchema
  .extend({
    subtasks: z.array(createSubtaskSchema).optional(),
    isCompleted: z.boolean(),
    notepadId: z.string().optional(),
  })
  .partial()
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const paginationMetaSchema = z.object({
  page: zPage(),
  limit: zLimit(),
  total: z.number(),
  totalPages: z.number(),
});

export const paginationQuerySchema = z.object({
  page: zPage(),
  limit: zLimit(),
});

const ResponseWithoutData = z.object({
  status: StatusResponseEnum,
  message: z.string(),
  meta: paginationMetaSchema.optional(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const TasksResponse = ResponseWithoutData.extend({
  data: z.array(dbTaskSchema).optional(),
});

export const TaskResponse = ResponseWithoutData.extend({
  data: z.union([dbTaskSchema, z.null()]).optional(),
});

export const NotepadResponse = ResponseWithoutData.extend({
  data: dbNotepadSchema.optional(),
});

export const NotepadWithoutTasksResponse = ResponseWithoutData.extend({
  data: z.array(notepadWithoutTasksSchema).optional(),
});

export const taskSortSchema = z
  .object({
    sortBy: z.enum(['createdDate', 'dueDate', 'priority']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
  })
  .strict();

export const taskSearchSchema = z
  .object({
    search: z.string().min(1).optional(),
  })
  .strict();

export const taskFilterSchema = z
  .object({
    isCompleted: z.union([z.literal('true'), z.literal('false')]).optional(),
    priority: PriorityEnum.optional(),
    hasDueDate: z.union([z.literal('true'), z.literal('false')]).optional(),
  })
  .strict();

export const taskQueryParamsSchema = taskFilterSchema
  .extend({
    ...taskSortSchema.shape,
    ...taskSearchSchema.shape,
    ...paginationQuerySchema.shape,
  })
  .partial();

export type Notepad = z.infer<typeof dbNotepadSchema>;
export type Task = z.infer<typeof dbTaskSchema>;
export type Subtask = z.infer<typeof createSubtaskSchema>;
export type CreateNotepad = z.infer<typeof createNotepadSchema>;
export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type TasksResponse = z.infer<typeof TasksResponse>;
export type TaskResponse = z.infer<typeof TaskResponse>;
export type NotepadResponse = z.infer<typeof NotepadResponse>;
export type NotepadWithoutTasksResponse = z.infer<
  typeof NotepadWithoutTasksResponse
>;

export type TaskFilter = z.infer<typeof taskFilterSchema>;
export type TaskSort = z.infer<typeof taskSortSchema>;
export type TaskSearch = z.infer<typeof taskSearchSchema>;
export type TaskQueryParams = z.infer<typeof taskQueryParamsSchema>;
