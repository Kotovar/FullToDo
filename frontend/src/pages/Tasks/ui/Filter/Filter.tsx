import type { SetURLSearchParams } from 'react-router';
import { COLORS, Icon, ICON_SIZES } from '@shared/ui';
import { Chip } from '@shared/ui';
import { FiltersState, useFilterLabels } from '@pages/Tasks/lib';
import { useRef, useState } from 'react';
import { FiltersMenu } from './FiltersMenu';

interface FilterProps {
  params: URLSearchParams;
  setParams: SetURLSearchParams;
}

export const Filter = ({ params, setParams }: FilterProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const labels = useFilterLabels(params);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const handleRemoveFilter = (key: string) => {
    setParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete(key);

      return newParams;
    });
  };

  const handleUpdateFilter = (newFilters: FiltersState) => {
    setParams(prev => {
      const newParams = new URLSearchParams(prev);

      (Object.keys(newFilters) as Array<keyof FiltersState>).forEach(key => {
        const value = newFilters[key];
        if (value !== undefined && value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      return newParams;
    });
  };

  return (
    <div className='flex'>
      <div className='hidden flex-wrap items-center justify-center-safe gap-2 md:flex [&:not(:empty)]:mr-2'>
        {labels.map(({ key, label }) => {
          return (
            <Chip
              key={`${key}-${label}`}
              label={label}
              onDelete={() => handleRemoveFilter(key)}
            />
          );
        })}
      </div>
      <div className='flex-end flex items-center gap-2'>
        <span>Фильтры{labels.length > 0 && ` (${labels.length})`}</span>
        <button
          ref={buttonRef}
          aria-label='Сменить фильтр'
          className='cursor-pointer'
          onClick={toggleMenu}
        >
          <Icon
            name='filter'
            size={ICON_SIZES.FILTERS}
            stroke={COLORS.ACCENT}
          />
        </button>
        {isMenuOpen && (
          <FiltersMenu
            labels={labels}
            buttonRef={buttonRef}
            closeMenu={closeMenu}
            onApply={handleUpdateFilter}
          />
        )}
      </div>
    </div>
  );
};
