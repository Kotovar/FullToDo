import { type RefObject, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, RadioGroup } from '@shared/ui';
import { useFocusTrap } from '@shared/lib';
import { getEmptyFilters, getInitialFilters, getFilterGroups } from './utils';
import type { FilterLabel, FiltersState } from '@pages/Tasks/lib';

interface FiltersMenuProps {
  labels: FilterLabel[];
  buttonRef: RefObject<HTMLButtonElement | null>;
  closeMenu: () => void;
  onApply: (newFilters: FiltersState) => void;
}

export const FiltersMenu = ({
  labels,
  buttonRef,
  closeMenu,
  onApply,
}: FiltersMenuProps) => {
  const menuRef = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FiltersState>(() =>
    getInitialFilters(labels),
  );

  useFocusTrap(menuRef, buttonRef, closeMenu);

  const handleChange = useCallback(
    <K extends keyof FiltersState>(name: K, value: FiltersState[K]) => {
      setFilters(prev => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onApply(filters);
      closeMenu();
    },
    [closeMenu, filters, onApply],
  );

  const handleReset = useCallback(() => {
    setFilters(getEmptyFilters());
  }, []);

  const filterGroups = getFilterGroups(t);

  return (
    <dialog
      className='border-bg-dark bg-light absolute top-full z-10 block rounded-md border p-2 shadow-md md:right-0'
      aria-modal='true'
      aria-labelledby='modal'
      ref={menuRef}
    >
      <form id='filterForm' onSubmit={handleSubmit} className='flex flex-col'>
        {filterGroups.map(group => (
          <RadioGroup
            key={group.name}
            name={group.title}
            options={group.options}
            value={filters[group.name]}
            onChange={value => handleChange(group.name, value)}
          />
        ))}
      </form>
      <div className='flex justify-between gap-1 pt-2 text-sm'>
        <Button
          appearance='ghost'
          onClick={handleReset}
          padding='sm'
          className='hover:underline'
        >
          {t('reset')}
        </Button>
        <Button
          className='focus-visible:ring-dark focus:outline-none focus-visible:ring-2'
          form='filterForm'
          padding='sm'
          type='submit'
        >
          {t('apply')}
        </Button>
      </div>
    </dialog>
  );
};
