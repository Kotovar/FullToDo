import { Subtask } from '@sharedCommon/*';
import { SubtaskAction } from '..';

export const handleSubtaskAction = (
  currentSubtasks: Subtask[],
  action: SubtaskAction,
): Subtask[] => {
  const { type, id } = action;
  const index = currentSubtasks.findIndex(subtask => subtask._id === id);

  if (index === -1) return currentSubtasks;
  const existing = currentSubtasks[index];

  switch (type) {
    case 'delete':
      return currentSubtasks.filter(subtasks => subtasks._id !== id);

    case 'update':
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

    default:
      return currentSubtasks;
  }
};
