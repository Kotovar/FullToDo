import type { ComponentPropsWithoutRef } from 'react';
import type { Task } from '@sharedCommon/*';

interface SubtaskTitleProps extends ComponentPropsWithoutRef<'span'> {
  task: Task;
}

export const SubtaskTitle = (props: SubtaskTitleProps) => {
  const { task, ...rest } = props;

  return (
    <span className='flex items-center gap-2 p-2' {...rest}>
      {task.title}
    </span>
  );
};
