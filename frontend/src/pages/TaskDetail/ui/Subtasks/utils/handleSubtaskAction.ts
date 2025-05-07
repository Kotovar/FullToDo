import { Subtask } from '@sharedCommon/*';
import { SubtaskAction } from '..';

export const handleSubtaskAction = (
  currentSubtasks: Subtask[],
  action: SubtaskAction,
): Subtask[] => {
  const { type, id } = action;
  const index = currentSubtasks.findIndex(subtask => subtask._id === id);

  if (index === -1) return currentSubtasks;

  if (type === 'delete') {
    return currentSubtasks.toSpliced(index, 1);
  }

  return currentSubtasks.toSpliced(index, 1, {
    isCompleted: action.isCompleted,
    title: action.title,
    _id: id,
  });
};
