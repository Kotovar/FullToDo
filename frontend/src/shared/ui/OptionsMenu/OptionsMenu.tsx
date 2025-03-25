import { ComponentPropsWithRef } from 'react';

interface OptionsMenu extends ComponentPropsWithRef<'div'> {
  path?: string;
  handleClickRename: () => void;
  handleClickDelete: () => void;
}

export const OptionsMenu = (props: OptionsMenu) => {
  const { handleClickRename, handleClickDelete, ...rest } = props;

  return (
    <div
      className='border-bg-second absolute flex w-max -translate-x-full flex-col border-1'
      popover='manual'
      {...rest}
    >
      <button
        className='hover:bg-accent/40 cursor-pointer p-2'
        type='button'
        onClick={handleClickRename}
      >
        Переименовать
      </button>
      <button
        className='bg-bg-second hover:bg-accent/40 cursor-pointer p-2'
        type='button'
        onClick={handleClickDelete}
      >
        Удалить
      </button>
    </div>
  );
};
