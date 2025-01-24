import type { ComponentPropsWithoutRef } from 'react';
import DotsIcon from './three-dots-vertical.svg?react';

interface Props extends ComponentPropsWithoutRef<'li'> {
  name: string;
  classname?: string;
}

export const Notebook = (props: Props) => {
  const { name, classname = '' } = props;

  return (
    <li className={classname}>
      <button className='grid w-full grid-cols-[1fr_2rem] grid-rows-1 items-center'>
        <span className='text-3xl'>{name}</span>
        <DotsIcon className='' />
      </button>
    </li>
  );
};
