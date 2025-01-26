import type { ComponentPropsWithoutRef } from 'react';
import { Link, useParams } from 'react-router';
import CircleEmptyIcon from './circle-empty.svg?react';
import DotsIcon from './three-dots-vertical.svg?react';

interface Props extends ComponentPropsWithoutRef<'li'> {
  name: string;
  taskId: number;
  progress: string;
}

export const TaskCard = (props: Props) => {
  const { name, progress, taskId, ...rest } = props;
  const { notepadId, taskIds } = useParams();

  return (
    <li {...rest}>
      <Link
        to={
          taskIds && Number(taskIds) === taskId
            ? `/notepad/${notepadId}`
            : `/notepad/${notepadId}/task/${taskId}`
        }
        className='flex items-center gap-x-2'
      >
        <div>
          <CircleEmptyIcon />
        </div>
        <div className='flex flex-col'>
          <span>{name}</span>
          <span className='text-sm'>{progress}</span>
        </div>
      </Link>
      <div>
        <DotsIcon />
      </div>
    </li>
  );
};
