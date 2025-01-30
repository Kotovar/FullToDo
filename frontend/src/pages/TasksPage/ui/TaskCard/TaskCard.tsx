import type { ComponentPropsWithoutRef } from 'react';
import { Link, useParams } from 'react-router';
import { COLORS, Icon } from '@shared/ui/Icon';

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
      <div>
        <Icon name='circleEmpty' size={32} stroke={COLORS.ACCENT} />
      </div>
      <Link
        to={
          taskIds && Number(taskIds) === taskId
            ? `/notepad/${notepadId}`
            : `/notepad/${notepadId}/task/${taskId}`
        }
        className='flex items-center gap-x-2'
      >
        <div className='flex flex-col'>
          <span>{name}</span>
          <span className='text-sm'>{progress}</span>
        </div>
      </Link>
      <div>
        <Icon name='threeDots' size={38} fill={COLORS.ACCENT} />
      </div>
    </li>
  );
};
