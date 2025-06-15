import { useRef, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { SortState } from '@pages/Tasks/lib';
import { commonLabels } from './constants';
import { useFocusTrap } from '@shared/lib';

interface SortMenuProps {
  buttonRef: RefObject<HTMLButtonElement | null>;
  closeMenu: () => void;
  onApply: (sort: SortState) => void;
}

export const SortMenu = ({ buttonRef, closeMenu, onApply }: SortMenuProps) => {
  const menuRef = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();

  useFocusTrap(menuRef, buttonRef, closeMenu);

  const handleSubmit = (e: React.FormEvent, sort: SortState) => {
    e.preventDefault();
    onApply(sort);
    closeMenu();
  };

  type Entries<T> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T][];

  const sortGroups = Object.entries(commonLabels) as Entries<
    typeof commonLabels
  >;

  return (
    <dialog
      className='border-bg-dark bg-light absolute top-full flex w-max flex-col items-center rounded-md border p-2 shadow-md md:left-0'
      aria-modal='true'
      aria-labelledby='modal'
      ref={menuRef}
    >
      <form className='flex flex-col items-end text-base'>
        {sortGroups.map(([sort, label]) => (
          <button
            className='cursor-pointer px-2 hover:rounded hover:bg-current/10'
            type='button'
            key={sort}
            onClick={e => handleSubmit(e, sort)}
          >
            {t(label)}
          </button>
        ))}
      </form>
    </dialog>
  );
};
