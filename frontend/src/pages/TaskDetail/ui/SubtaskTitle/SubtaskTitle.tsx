import type { ComponentPropsWithoutRef } from 'react';
import type { Task } from '@sharedCommon/*';
import { COLORS, Icon } from '@shared/ui';

interface SubtaskTitleProps extends ComponentPropsWithoutRef<'span'> {
  task: Task;
}

export const SubtaskTitle = (props: SubtaskTitleProps) => {
  const { task, ...rest } = props;

  return (
    <span className='flex gap-2 p-1' {...rest}>
      {task.isCompleted ? (
        <Icon name='circleFilled' fill={COLORS.ACCENT} />
      ) : (
        <Icon name='circleEmpty' stroke={COLORS.ACCENT} />
      )}
      {task.title}
    </span>
  );
};
