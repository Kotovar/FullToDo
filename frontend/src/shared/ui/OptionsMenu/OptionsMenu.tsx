import { ComponentPropsWithRef, RefObject, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';

interface OptionsMenu extends ComponentPropsWithRef<'div'> {
  buttonRef: RefObject<HTMLButtonElement | null>;
  path?: string;
  renameHandler: () => void;
  deleteHandler: () => void;
  closeMenu: () => void;
}

export const OptionsMenu = (props: OptionsMenu) => {
  const { buttonRef, renameHandler, deleteHandler, closeMenu, ...rest } = props;
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useOnClickOutside(
    [ref as RefObject<HTMLElement>, buttonRef as RefObject<HTMLElement>],
    closeMenu,
  );

  return (
    <div
      className='border-bg-second absolute top-full flex w-max -translate-x-full flex-col rounded-md border bg-white p-2 shadow-md'
      ref={ref}
      {...rest}
    >
      <button
        className='relative z-10 w-full cursor-pointer bg-white p-2 hover:brightness-60'
        type='button'
        onClick={renameHandler}
      >
        {t('rename')}
      </button>
      <button
        className='bg-bg-second relative z-10 w-full cursor-pointer p-2 hover:brightness-70'
        type='button'
        onClick={deleteHandler}
      >
        {t('delete')}
      </button>
    </div>
  );
};
