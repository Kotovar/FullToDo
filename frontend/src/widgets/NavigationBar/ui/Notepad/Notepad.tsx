import type { ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router';
import { COLORS, Icon } from '@shared/ui/Icon';

interface Props extends ComponentPropsWithoutRef<'li'> {
  name: string;
  path: string;
  changeVisibility?: () => void;
}

export const Notepad = (props: Props) => {
  const { name, path, changeVisibility, ...rest } = props;

  return (
    <li {...rest}>
      <Link to={path} onClick={changeVisibility} className='w-full'>
        <span className='text-3xl'>{name}</span>
      </Link>
      <button>
        <Icon name='threeDots' size={38} fill={COLORS.ACCENT} />
      </button>
    </li>
  );
};
