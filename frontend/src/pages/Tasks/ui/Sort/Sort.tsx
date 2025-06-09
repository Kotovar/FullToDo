import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SetURLSearchParams } from 'react-router';
import { Icon, ICON_SIZES } from '@shared/ui';
import { useDarkMode } from '@shared/lib';
import { SortMenu, useSort } from '.';

interface SortProps {
  params: URLSearchParams;
  setParams: SetURLSearchParams;
}

export const Sort = ({ params, setParams }: SortProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { sort, order, toggleOrder, updateSort } = useSort(params, setParams);
  const { t } = useTranslation();
  const { fill } = useDarkMode();

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <div className='relative flex w-60 items-center justify-end-safe gap-2'>
      <button
        aria-label={t('sort.change')}
        className='relative cursor-pointer p-1 hover:rounded hover:bg-current/10'
        ref={buttonRef}
        onClick={toggleMenu}
      >
        {sort.label}
      </button>
      {isMenuOpen && (
        <SortMenu
          buttonRef={buttonRef}
          onApply={updateSort}
          closeMenu={closeMenu}
        />
      )}
      <button
        aria-label={t('sort.order')}
        className='relative cursor-pointer p-1 hover:rounded hover:bg-current/10'
        onClick={toggleOrder}
      >
        <Icon
          name={order === 'desc' ? 'arrowDown' : 'arrowUp'}
          ariaLabel={order === 'desc' ? 'sort descending' : 'sort ascending'}
          size={ICON_SIZES.FILTERS}
          fill={fill}
        />
      </button>
    </div>
  );
};
