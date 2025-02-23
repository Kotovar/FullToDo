import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().optional().default(false),
});

export type CreateTodoInput = z.infer<typeof createTaskSchema>;
