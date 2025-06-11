import { ComponentPropsWithRef, RefObject, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusTrap } from '@shared/lib';

interface OptionsMenu extends ComponentPropsWithRef<'dialog'> {
  buttonRef: RefObject<HTMLButtonElement | null>;
  path?: string;
  renameHandler: () => void;
  deleteHandler: () => void;
  closeMenu: () => void;
}

export const OptionsMenu = (props: OptionsMenu) => {
  const { buttonRef, renameHandler, deleteHandler, closeMenu, ...rest } = props;
  const menuRef = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();

  useFocusTrap(menuRef, buttonRef, closeMenu);

  return (
    <dialog
      className='border-bg-dark bg-light absolute top-full flex w-max -translate-x-full flex-col gap-0.5 rounded-md border p-2 shadow-md'
      ref={menuRef}
      aria-modal='true'
      {...rest}
    >
      <button
        className='bg-light relative z-10 w-full cursor-pointer rounded-md p-2 hover:brightness-60'
        type='button'
        onClick={renameHandler}
      >
        {t('rename')}
      </button>
      <button
        className='bg-bg-second relative z-10 w-full cursor-pointer rounded-md p-2 hover:brightness-70'
        type='button'
        onClick={deleteHandler}
      >
        {t('delete')}
      </button>
    </dialog>
  );
};
