import { useRef, useState } from 'react';
import type { SetURLSearchParams } from 'react-router';
import { COLORS, Icon, ICON_SIZES } from '@shared/ui';
import { SortMenu } from './SortMenu';
import { useSort } from './useSort';

interface SortProps {
  params: URLSearchParams;
  setParams: SetURLSearchParams;
}

export const Sort = ({ params, setParams }: SortProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { sort, order, toggleOrder, updateSort } = useSort(params, setParams);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <div className='relative flex w-60 items-center justify-end-safe gap-2'>
      <button
        aria-label='Сменить сортировку'
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
        aria-label='Сменить порядок сортировки'
        className='relative cursor-pointer p-1 hover:rounded hover:bg-current/10'
        onClick={toggleOrder}
      >
        <Icon
          name={order === 'desc' ? 'arrowDown' : 'arrowUp'}
          ariaLabel={order === 'desc' ? 'sort descending' : 'sort ascending'}
          size={ICON_SIZES.FILTERS}
          fill={COLORS.ACCENT}
        />
      </button>
    </div>
  );
};
