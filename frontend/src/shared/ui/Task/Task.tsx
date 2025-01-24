import type { ComponentPropsWithoutRef } from 'react';
import CircleEmptyIcon from './circle-empty.svg?react';
import DotsIcon from './three-dots-vertical.svg?react';

interface Props extends ComponentPropsWithoutRef<'li'> {
  name: string;
  status: string;
  classname?: string;
}

export const Task = (props: Props) => {
  const { name, status, classname = '' } = props;

  return (
    <li className={classname}>
      <div>
        <CircleEmptyIcon />
      </div>
      <div className='flex flex-col'>
        <span>{name}</span>
        <span className='text-sm'>{status}</span>
      </div>
      <div>
        <DotsIcon />
      </div>
    </li>
  );
};
