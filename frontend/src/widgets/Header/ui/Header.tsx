import type { ComponentPropsWithoutRef } from 'react';
import { COLORS, Icon } from '@shared/ui/Icon';

interface Props extends ComponentPropsWithoutRef<'header'> {
  changeVisibility: () => void;
}

export const Header = (props: Props) => {
  const { changeVisibility, ...rest } = props;

  return (
    <header {...rest}>
      <div>
        <button type='button' className='flex p-1' onClick={changeVisibility}>
          <Icon name='burger' fill={COLORS.WHITE} size={32} />
        </button>
      </div>
      <div className='flex h-10 w-full items-center gap-x-1 rounded-xl bg-white px-2 md:w-[60%]'>
        <Icon name='loupe' fill={COLORS.ACCENT} />
        <input className='w-full outline-0' type='search' placeholder='Поиск' />
      </div>
      <div className='flex gap-x-2'>
        <button type='button' className='flex items-center gap-x-1 px-1'>
          <Icon name='flagRu' />
          <span className='text-white'>Русский</span>
        </button>
        <button
          type='button'
          className='hover:border-accent-light flex items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
        >
          <Icon name='themeLight' fill={COLORS.WHITE} />
        </button>
      </div>
    </header>
  );
};
