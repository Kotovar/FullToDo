import type { ComponentPropsWithoutRef } from 'react';
import type { Task } from '@entities/Task';
import { COLORS, Icon } from '@shared/ui/Icon';

interface Props extends ComponentPropsWithoutRef<'span'> {
  task: Task;
}

export const SubtaskTitle = (props: Props) => {
  const { task, ...rest } = props;

  return (
    <span className='flex gap-2 p-1' {...rest}>
      {task.subtasksCompleted ? (
        <Icon name='circleFilled' fill={COLORS.ACCENT} />
      ) : (
        <Icon name='circleEmpty' stroke={COLORS.ACCENT} />
      )}

      {task.name}
    </span>
  );
};
