import type { MutationMethods, QueryError } from '@shared/api';
import { Task } from '@sharedCommon/*';

export interface UseTasksProps {
  notepadId?: string;
  onSuccess?: (method: MutationMethods) => void;
  onError?: (error: QueryError) => void;
}

export interface MutationUpdateProps {
  updatedTask: Partial<Task>;
  id: string;
}
