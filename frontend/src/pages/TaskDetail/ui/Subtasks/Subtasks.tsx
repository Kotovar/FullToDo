import { useMemo, type ComponentPropsWithoutRef } from 'react';
import type { Subtask } from '@sharedCommon/*';
import { debounce } from '@shared/lib/debounce';
import { SubtaskItem } from '../SubtaskItem';
import { SubtaskAction } from './types';

interface SubtasksProps extends ComponentPropsWithoutRef<'ul'> {
  subtasks: Subtask[];
  updateSubtask: (action: SubtaskAction) => void;
}

export const Subtasks = ({
  subtasks = [],
  updateSubtask,
  ...rest
}: SubtasksProps) => {
  const debouncedUpdateSubtask = useMemo(
    () =>
      debounce((action: SubtaskAction) => {
        updateSubtask(action);
      }, 300),
    [updateSubtask],
  );

  return (
    <ul className='flex list-none flex-col' {...rest}>
      {subtasks.map(subtask => (
        <SubtaskItem
          key={subtask._id}
          subtask={subtask}
          updateSubtask={debouncedUpdateSubtask}
        />
      ))}
    </ul>
  );
};
