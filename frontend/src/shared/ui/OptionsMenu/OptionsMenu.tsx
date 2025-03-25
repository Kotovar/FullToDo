import { ComponentPropsWithRef } from 'react';

interface OptionsMenu extends ComponentPropsWithRef<'div'> {
  path?: string;
  renameHandler: () => void;
  deleteHandler: () => void;
}

export const OptionsMenu = (props: OptionsMenu) => {
  const { renameHandler, deleteHandler, ...rest } = props;

  return (
    <div
      className='border-bg-second absolute flex w-max -translate-x-full flex-col border-1'
      {...rest}
    >
      <button
        className='hover:bg-accent/40 cursor-pointer p-2'
        type='button'
        onClick={renameHandler}
      >
        Переименовать
      </button>
      <button
        className='bg-bg-second hover:bg-accent/40 cursor-pointer p-2'
        type='button'
        onClick={deleteHandler}
      >
        Удалить
      </button>
    </div>
  );
};
