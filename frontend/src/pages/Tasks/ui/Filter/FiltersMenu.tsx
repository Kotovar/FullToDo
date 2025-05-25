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
    options: [
      { value: '', label: 'Все' },
      { value: 'true', label: 'Выполненные' },
      { value: 'false', label: 'Активные' },
    ],
  },
  {
    name: 'hasDueDate',
    options: [
      { value: '', label: 'Все' },
      { value: 'true', label: 'Со сроком' },
      { value: 'false', label: 'Без срока' },
    ],
  },
  {
    name: 'priority',
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
      className='border-bg-second bg-grey-light absolute w-max translate-y-full flex-col rounded-sm border-2'
      ref={ref}
    >
      <form onSubmit={handleSubmit} className='flex flex-col'>
        {filterGroups.map(group => (
          <RadioGroup
            key={group.name}
            name={group.name}
            options={group.options}
            value={filters[group.name]}
            onChange={value => handleChange(group.name, value)}
          />
        ))}
      </form>
      <div className='flex justify-between pt-4'>
        <button
          type='button'
          onClick={handleReset}
          className='text-sm text-gray-600 hover:text-gray-800'
        >
          Сбросить
        </button>
        <button
          type='submit'
          className='rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600'
          onClick={handleSubmit}
        >
          Применить
        </button>
      </div>
    </div>
  );
};
