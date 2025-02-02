import { ComponentPropsWithRef } from 'react';

interface OptionsMenu extends ComponentPropsWithRef<'div'> {
  path?: string;
}

export const OptionsMenu = (props: OptionsMenu) => {
  const { ...rest } = props;

  return (
    <div
      className='border-bg-second absolute flex w-max -translate-x-full flex-col border-1'
      popover='manual'
      {...rest}
    >
      <button className='hover:bg-accent/40 p-2' type='button'>
        Переименовать
      </button>
      <button className='bg-bg-second hover:bg-accent/40 p-2' type='button'>
        Удалить
      </button>
    </div>
  );
};
