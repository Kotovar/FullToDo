import type { ComponentPropsWithoutRef } from 'react';
import { Button, COLORS, Icon } from '@shared/ui';
import type { Subtask } from '@sharedCommon/*';

interface SubtasksProps extends ComponentPropsWithoutRef<'ul'> {
  subtasks: Subtask[];
  updateSubtask: (id: string, title: string, isCompleted: boolean) => void;
  deleteSubtask: (id: string) => void;
}

export const Subtasks = (props: SubtasksProps) => {
  const { subtasks = [], updateSubtask, deleteSubtask, ...rest } = props;

  return (
    <ul className='flex list-none flex-col' {...rest}>
      {subtasks.map(({ isCompleted, title, _id }) => {
        return (
          <li
            key={_id}
            className='odd:bg-bg-second even:bg-grey-light grid grid-cols-[1rem_1fr_1rem] items-center gap-4 p-2'
          >
            <Button
              appearance='ghost'
              onClick={() => updateSubtask(_id, title, !isCompleted)}
              padding='none'
            >
              <Icon
                name={isCompleted ? 'circleFilled' : 'circleEmpty'}
                fill={isCompleted ? COLORS.ACCENT : undefined}
                stroke={!isCompleted ? COLORS.ACCENT : undefined}
              />
            </Button>
            <span>{title}</span>
            <Button
              appearance='ghost'
              onClick={() => deleteSubtask(_id)}
              padding='none'
            >
              <Icon name='cross' fill={COLORS.ACCENT} />
            </Button>
          </li>
        );
      })}
    </ul>
  );
};
