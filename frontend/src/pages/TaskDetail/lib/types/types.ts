import type { MutationMethods } from '@shared/api';
import type { Subtask, Task } from 'shared/schemas';

export type ValueType = {
  title: string;
  dueDate: string;
  description: string;
  subtasks: Subtask[];
};

export type SubtaskAction =
  | {
      type: 'update';
      id: string;
      title: string;
      isCompleted: boolean;
    }
  | {
      type: 'delete';
      id: string;
    };

export type UpdateTask = (
  updatedTask: Partial<Task>,
  id: string,
  subtaskActionType: MutationMethods,
) => Promise<boolean>;
