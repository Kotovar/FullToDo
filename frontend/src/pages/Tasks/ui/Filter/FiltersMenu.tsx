import { type RefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioGroup } from '@shared/ui';
import { useFocusTrap } from '@shared/lib';
import type { FilterLabel, FiltersState } from '@pages/Tasks/lib';
import { getFilterGroups } from './constants';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FiltersState>(() => {
    const initialFilters: FiltersState = {
      isCompleted: '',
      hasDueDate: '',
      priority: '',
    };

    labels.forEach(label => {
      initialFilters[label.key] = label.value;
    });

    return initialFilters;
  });

  useFocusTrap(menuRef, buttonRef, closeMenu);

  const handleChange = (name: keyof FiltersState, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(filters);
    closeMenu();
  };

  const handleReset = () => {
    setFilters({
      isCompleted: '',
      hasDueDate: '',
      priority: '',
    });
  };

  const filterGroups = getFilterGroups(t);

  return (
    <div
      className='border-bg-dark bg-light absolute top-full z-10 rounded-md border p-2 shadow-md md:right-0'
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
        <button
          type='button'
          onClick={handleReset}
          className='w-16 text-sm hover:underline'
        >
          {t('reset')}
        </button>
        <button
          type='submit'
          className='bg-accent hover:bg-accent/80 dark:border-dark w-22 rounded border-1 px-2 py-1 text-sm text-white'
          form='filterForm'
        >
          {t('apply')}
        </button>
      </div>
    </div>
  );
};
