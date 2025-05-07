import type { MutationMethods, QueryError } from '@shared/api';
import type { Task } from '@sharedCommon/*';

export interface UseTasksProps {
  notepadId?: string;
  taskId?: string;
  onSuccess?: (method: MutationMethods) => void;
  onError?: (error: QueryError) => void;
}

export interface MutationUpdateProps {
  updatedTask: Partial<Task>;
  id: string;
}
