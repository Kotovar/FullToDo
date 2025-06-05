import type { ComponentPropsWithoutRef } from 'react';
import type { Subtask } from '@sharedCommon/*';
import { SubtaskItem } from '../SubtaskItem';
import { SubtaskAction } from './types';

interface SubtasksProps extends ComponentPropsWithoutRef<'ul'> {
  subtasks: Subtask[];
  updateSubtask: (action: SubtaskAction) => void;
}

export const Subtasks = ({
  subtasks,
  updateSubtask,
  ...rest
}: SubtasksProps) => {
  return (
    <ul className='flex list-none flex-col' {...rest}>
      {subtasks.map(subtask => (
        <SubtaskItem
          key={subtask._id}
          subtask={subtask}
          updateSubtask={updateSubtask}
        />
      ))}
    </ul>
  );
};
