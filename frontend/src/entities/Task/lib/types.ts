import type { Entity } from '@shared/lib';
import type { Task } from '@sharedCommon/*';

interface TaskBase {
  notepadId?: string;
  entity: Entity;
}

export interface UseTaskDetailProps extends TaskBase {
  taskId: string;
}

export interface UseCreateTaskProps extends TaskBase {}

export interface UseTasksProps extends Omit<TaskBase, 'notepadId'> {
  notepadId: string;

  params: URLSearchParams;
}

export interface MutationUpdateProps {
  updatedTask: Partial<Omit<Task, '_id' | 'createdDate' | 'progress'>>;

  id: string;
}
