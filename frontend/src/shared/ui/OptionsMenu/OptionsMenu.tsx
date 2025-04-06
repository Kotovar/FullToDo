import { ComponentPropsWithRef, RefObject, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

interface OptionsMenu extends ComponentPropsWithRef<'div'> {
  path?: string;
  renameHandler: () => void;
  deleteHandler: () => void;
  closeMenu: () => void;
}

export const OptionsMenu = (props: OptionsMenu) => {
  const { renameHandler, deleteHandler, closeMenu, ...rest } = props;
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref as RefObject<HTMLElement>, closeMenu);

  return (
    <div
      className='border-bg-second absolute flex w-max -translate-x-full flex-col border-1'
      ref={ref}
      {...rest}
    >
      <button
        className='cursor-pointer bg-white p-2 hover:brightness-60'
        type='button'
        onClick={renameHandler}
      >
        Переименовать
      </button>
      <button
        className='bg-bg-second cursor-pointer p-2 hover:brightness-70'
        type='button'
        onClick={deleteHandler}
      >
        Удалить
      </button>
    </div>
  );
};
