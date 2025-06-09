import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SetURLSearchParams } from 'react-router';
import { Icon, Chip, ICON_SIZES } from '@shared/ui';
import { useDarkMode } from '@shared/lib';
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const labels = useFilterLabels(params);
  const { fill } = useDarkMode();

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
        {t('filters.title')}
        {labels.length > 0 && (
          <span className='hidden md:inline'>{` (${labels.length})`}</span>
        )}
        <button
          ref={buttonRef}
          aria-label={t('filters.change')}
          className='cursor-pointer p-1 hover:rounded hover:bg-current/10'
          onClick={toggleMenu}
        >
          <Icon name='filter' size={ICON_SIZES.FILTERS} stroke={fill} />
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
