import { SubtaskAction } from '@pages/TaskDetail/lib';
import type { Subtask } from '@sharedCommon/*';

export const handleSubtaskAction = (
  currentSubtasks: Subtask[],
  action: SubtaskAction,
): Subtask[] => {
  const { type, id } = action;
  const index = currentSubtasks.findIndex(subtask => subtask._id === id);

  if (index === -1) return currentSubtasks;
  const existing = currentSubtasks[index];

  if (type === 'delete') {
    return currentSubtasks.filter(subtasks => subtasks._id !== id);
  }

  if (
    existing.title === action.title &&
    existing.isCompleted === action.isCompleted
  ) {
    return currentSubtasks;
  }

  return currentSubtasks.map(subtask =>
    subtask._id === id
      ? { _id: id, isCompleted: action.isCompleted, title: action.title }
      : subtask,
  );
};
