import type { ComponentPropsWithoutRef } from 'react';
import type { Subtask } from '@sharedCommon/*';
import { SubtaskItem } from '../SubtaskItem';
import { SubtaskAction } from './types';
import { useAutoScrollToNewItem } from '@shared/lib';

interface SubtasksProps extends ComponentPropsWithoutRef<'ul'> {
  subtasks: Subtask[];
  notepadId?: string;
  updateSubtask: (action: SubtaskAction) => void;
}

export const Subtasks = ({
  subtasks,
  notepadId,
  updateSubtask,
  ...rest
}: SubtasksProps) => {
  const listRef = useAutoScrollToNewItem<HTMLUListElement>(
    notepadId ?? '',
    subtasks,
  );

  return (
    <ul
      className='scrollbar-tasks flex list-none flex-col overflow-y-scroll pr-2'
      ref={listRef}
      {...rest}
    >
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
