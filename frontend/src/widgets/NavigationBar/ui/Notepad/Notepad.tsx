import type { ComponentPropsWithoutRef } from 'react';
import DotsIcon from './three-dots-vertical.svg?react';
import { Link } from 'react-router';

interface Props extends ComponentPropsWithoutRef<'li'> {
  name: string;
  path: string;
}

export const Notepad = (props: Props) => {
  const { name, path, ...rest } = props;

  return (
    <li {...rest}>
      <Link to={path} className='w-full'>
        <span className='text-3xl'>{name}</span>
      </Link>
      <button>
        <DotsIcon className='' />
      </button>
    </li>
  );
};
