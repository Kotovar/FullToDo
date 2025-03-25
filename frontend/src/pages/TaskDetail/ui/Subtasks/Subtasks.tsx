import type { ComponentPropsWithoutRef } from 'react';
import type { Subtask } from '@sharedCommon/*';
import { SubtaskItem } from '../SubtaskItem';

interface SubtasksProps extends ComponentPropsWithoutRef<'ul'> {
  subtasks: Subtask[];
  updateSubtask: (id: string, title: string, isCompleted: boolean) => void;
  deleteSubtask: (id: string) => void;
}

export const Subtasks = ({
  subtasks = [],
  updateSubtask,
  deleteSubtask,
  ...rest
}: SubtasksProps) => {
  return (
    <ul className='flex list-none flex-col' {...rest}>
      {subtasks.map(subtask => (
        <SubtaskItem
          key={subtask._id}
          subtask={subtask}
          updateSubtask={updateSubtask}
          deleteSubtask={deleteSubtask}
        />
      ))}
    </ul>
  );
};
