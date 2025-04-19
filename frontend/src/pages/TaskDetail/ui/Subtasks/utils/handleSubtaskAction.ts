import { Subtask } from '@sharedCommon/*';
import { SubtaskAction } from '../types';

export const handleSubtaskAction = (
  currentSubtasks: Subtask[],
  action: SubtaskAction,
): Subtask[] => {
  const { type, id } = action;
  const index = currentSubtasks.findIndex(subtask => subtask._id === id);

  if (index === -1) return currentSubtasks;

  return type === 'delete'
    ? currentSubtasks.toSpliced(index, 1)
    : currentSubtasks.toSpliced(index, 1, {
        isCompleted: action.isCompleted,
        title: action.title,
        _id: id,
      });
};
