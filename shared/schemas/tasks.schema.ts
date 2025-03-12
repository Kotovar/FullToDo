import { z } from 'zod';

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
type PriorityEnum = z.infer<typeof PriorityEnum>;

export const createNotepadSchema = z.object({
  title: z.coerce.string().min(1, 'Title is required'),
});

export const createSubtaskSchema = z.object({
  title: z.coerce.string().min(1, 'Title is required'),
  isCompleted: z.boolean().optional().default(false),
});

export const createTaskSchema = z.object({
  title: z.coerce.string().min(1, 'Title is required'),
  isCompleted: z.boolean().default(false),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  priority: PriorityEnum.optional(),
  subtasks: z.array(createSubtaskSchema).optional(),
});

export const dbTaskSchema = createTaskSchema.extend({
  createdDate: z.date(),
  notepadId: z.string(),
  _id: z.string(),
  progress: z.string(),
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
  .partial()
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

const ResponseWithoutData = z.object({
  status: StatusResponseEnum,
  message: z.string().optional(),
});

export const TasksResponse = ResponseWithoutData.extend({
  data: z.array(dbTaskSchema).optional(),
});

export const TaskResponse = ResponseWithoutData.extend({
  data: z.union([dbTaskSchema, z.null()]).optional(),
});

export const NotepadResponse = ResponseWithoutData.extend({
  data: z.array(dbNotepadSchema).optional(),
});

export const NotepadWithoutTasksResponse = ResponseWithoutData.extend({
  data: z.array(notepadWithoutTasksSchema).optional(),
});

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
