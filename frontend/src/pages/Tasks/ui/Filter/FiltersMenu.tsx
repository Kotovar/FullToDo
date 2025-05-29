import { type RefObject, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { RadioGroup } from '@shared/ui';
import type { FilterLabel, FiltersState } from '@pages/Tasks/lib';

interface FiltersMenuProps {
  labels: FilterLabel[];
  buttonRef: RefObject<HTMLButtonElement | null>;
  closeMenu: () => void;
  onApply: (newFilters: FiltersState) => void;
}

const filterGroups = [
  {
    name: 'isCompleted',
    title: 'статус',
    options: [
      { value: '', label: 'Все' },
      { value: 'true', label: 'Выполненные' },
      { value: 'false', label: 'Активные' },
    ],
  },
  {
    name: 'hasDueDate',
    title: 'срок',
    options: [
      { value: '', label: 'Все' },
      { value: 'true', label: 'Со сроком' },
      { value: 'false', label: 'Без срока' },
    ],
  },
  {
    name: 'priority',
    title: 'приоритет',
    options: [
      { value: '', label: 'Все' },
      { value: 'low', label: 'Низкий' },
      { value: 'medium', label: 'Средний' },
      { value: 'high', label: 'Высокий' },
    ],
  },
] as const;

export const FiltersMenu = ({
  labels,
  buttonRef,
  closeMenu,
  onApply,
}: FiltersMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
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

  useOnClickOutside(
    [ref as RefObject<HTMLElement>, buttonRef as RefObject<HTMLElement>],
    closeMenu,
  );

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

  return (
    <div
      className='border-bg-second absolute top-full z-10 rounded-md border bg-white p-2 shadow-md md:right-0'
      ref={ref}
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
          className='text-sm hover:underline'
        >
          Сбросить
        </button>
        <button
          type='submit'
          className='bg-accent-lighter hover:bg-accent-lighter/90 rounded px-2 py-1 text-sm text-white'
          form='filterForm'
        >
          Применить
        </button>
      </div>
    </div>
  );
};
