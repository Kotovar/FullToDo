import { useRef, RefObject, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SortState } from '@pages/Tasks/lib';
import { getTypedEntries, useFocusTrap } from '@shared/lib';
import { Button } from '@shared/ui';
import { commonLabels } from '../constants';

interface SortMenuProps {
  buttonRef: RefObject<HTMLButtonElement | null>;
  closeMenu: () => void;
  onApply: (sort: SortState) => void;
}

export const SortMenu = ({ buttonRef, closeMenu, onApply }: SortMenuProps) => {
  const menuRef = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();

  useFocusTrap(menuRef, buttonRef, closeMenu);

  const handleSubmit = useCallback(
    (e: React.FormEvent, sort: SortState) => {
      e.preventDefault();
      onApply(sort);
      closeMenu();
    },
    [closeMenu, onApply],
  );

  const handleSortClick = useCallback(
    (sort: SortState) => (e: React.FormEvent) => handleSubmit(e, sort),
    [handleSubmit],
  );

  const sortGroups = getTypedEntries(commonLabels);

  return (
    <dialog
      className='border-bg-dark bg-light absolute top-full flex w-max flex-col items-center rounded-md border p-2 shadow-md md:left-0'
      aria-modal='true'
      aria-labelledby='modal'
      ref={menuRef}
    >
      <form className='flex flex-col items-end text-base'>
        {sortGroups.map(([sort, label]) => (
          <Button
            onClick={handleSortClick(sort)}
            appearance='ghost'
            className='relative hover:bg-current/10'
            border='none'
            padding='sm'
            key={sort}
          >
            {t(label)}
          </Button>
        ))}
      </form>
    </dialog>
  );
};
