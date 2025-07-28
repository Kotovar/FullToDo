import { getFormattedDate } from './getFormattedDate';
import type { Task } from '@sharedCommon/*';

export const getForm = (initialTask?: Task | null) => {
  return {
    title: initialTask?.title || '',
    dueDate: initialTask?.dueDate ? getFormattedDate(initialTask.dueDate) : '',
    description: initialTask?.description || '',
    subtasks: initialTask?.subtasks || [],
  };
};
