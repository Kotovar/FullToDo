import type { ComponentPropsWithoutRef } from 'react';
import { COLORS, Icon, Input, Button } from '@shared/ui';

interface Props extends ComponentPropsWithoutRef<'header'> {
  changeVisibility: () => void;
}

export const Header = (props: Props) => {
  const { changeVisibility, ...rest } = props;

  return (
    <header {...rest}>
      <div>
        <button
          type='button'
          className='hover:border-accent-light flex items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
          onClick={changeVisibility}
        >
          <Icon name='burger' fill={COLORS.WHITE} size={32} />
        </button>
      </div>
      <Input
        placeholder='Поиск'
        type='text'
        containerClassName='flex h-10 w-full items-center gap-x-1 rounded-xl bg-white px-2 md:w-[60%]'
        leftContent={
          <Button appearance='ghost' padding='none' aria-label='Поиск'>
            <Icon name='loupe' fill={COLORS.ACCENT} />
          </Button>
        }
        className='w-full outline-0'
      />
      <div className='flex gap-x-2'>
        <button
          type='button'
          className='hover:border-accent-light flex items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
        >
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
