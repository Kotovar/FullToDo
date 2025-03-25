import type { ComponentPropsWithoutRef } from 'react';
import type { Subtask } from 'shared/schemas';

export interface ValueType {
  title: string;
  dueDate: string;
  description: string;
  subtasks: Subtask[];
}

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

export type TaskDetailProps = ComponentPropsWithoutRef<'div'>;
