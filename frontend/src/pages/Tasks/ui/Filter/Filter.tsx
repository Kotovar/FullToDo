import { useRef, useState } from 'react';
import type { SetURLSearchParams } from 'react-router';
import { COLORS, Icon, ICON_SIZES } from '@shared/ui';
import { Chip } from '@shared/ui';
import { FiltersMenu } from './FiltersMenu';
import { useFilters } from './useFilters';
import { useFilterLabels } from './useFilterLabels';

interface FilterProps {
  params: URLSearchParams;
  setParams: SetURLSearchParams;
}

export const Filter = ({ params, setParams }: FilterProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { handleRemoveFilter, handleUpdateFilter } = useFilters(setParams);
  const labels = useFilterLabels(params);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

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
      <div className='flex-end relative flex items-center gap-2'>
        <span>Фильтры{labels.length > 0 && ` (${labels.length})`}</span>
        <button
          ref={buttonRef}
          aria-label='Сменить фильтр'
          className='cursor-pointer p-1 hover:rounded hover:bg-current/10'
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
