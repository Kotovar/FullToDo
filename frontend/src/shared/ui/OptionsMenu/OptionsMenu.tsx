import {
  ComponentPropsWithRef,
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useFocusTrap } from '@shared/lib';

interface OptionsMenuProps extends ComponentPropsWithRef<'dialog'> {
  buttonRef: RefObject<HTMLButtonElement | null>;
  path?: string;
  renameHandler: () => void;
  deleteHandler: () => void;
  closeMenu: () => void;
}

const POSITION_TOP_WITH_BUTTON_HEIGHT = `-translate-y-[calc(100%+36px)]`;

export const OptionsMenu = (props: OptionsMenuProps) => {
  const { buttonRef, renameHandler, deleteHandler, closeMenu, ...rest } = props;
  const menuRef = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');

  const updateMenuPosition = useCallback(() => {
    if (!menuRef.current || !buttonRef.current) return;

    const dialogRect = menuRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const isOverflowBottom = dialogRect.bottom > viewportHeight;

    setPosition(isOverflowBottom ? 'top' : 'bottom');
  }, [buttonRef]);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    menu.setAttribute('inert', '');

    requestAnimationFrame(() => {
      menu.removeAttribute('inert');
    });
    updateMenuPosition();
  }, [updateMenuPosition]);

  const handleRename = useCallback(() => {
    renameHandler();
    closeMenu();
  }, [closeMenu, renameHandler]);

  const handleDelete = useCallback(() => {
    deleteHandler();
    closeMenu();
  }, [closeMenu, deleteHandler]);

  useFocusTrap(menuRef, buttonRef, closeMenu);

  return (
    <dialog
      className={clsx(
        {
          [POSITION_TOP_WITH_BUTTON_HEIGHT]: position === 'top',
        },
        'border-bg-dark bg-light absolute top-full flex w-max -translate-x-full flex-col gap-0.5 rounded-md border p-2 shadow-md',
      )}
      ref={menuRef}
      aria-modal='true'
      aria-labelledby='modal'
      {...rest}
    >
      <button
        className='bg-light text text-dark relative z-10 w-full cursor-pointer rounded-md p-2 hover:brightness-60'
        type='button'
        onClick={handleRename}
      >
        {t('rename')}
      </button>
      <button
        className='bg-bg-second text-dark relative z-10 w-full cursor-pointer rounded-md p-2 hover:brightness-70'
        type='button'
        onClick={handleDelete}
      >
        {t('delete')}
      </button>
    </dialog>
  );
};
