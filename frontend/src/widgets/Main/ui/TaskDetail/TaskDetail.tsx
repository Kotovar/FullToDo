import type { ComponentPropsWithoutRef } from 'react';

interface Props extends ComponentPropsWithoutRef<'li'> {
  taskId: string;
}

export const TaskDetail = (props: Props) => {
  const { taskId, ...rest } = props;

  return (
    <li {...rest} className='list-none'>
      <p>{`Это детали задачи ${taskId}`}</p>
    </li>
  );
};
