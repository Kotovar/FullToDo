import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SetURLSearchParams } from 'react-router';
import { Button, Icon, ICON_SIZES } from '@shared/ui';
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

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  return (
    <div className='relative flex w-60 items-center justify-end-safe gap-2'>
      <Button
        onClick={toggleMenu}
        appearance='ghost'
        className='relative p-1 hover:bg-current/10'
        aria-label={t('sort.change')}
        ref={buttonRef}
        border='none'
      >
        {sort.label}
      </Button>
      {isMenuOpen && (
        <SortMenu
          buttonRef={buttonRef}
          onApply={updateSort}
          closeMenu={closeMenu}
        />
      )}
      <Button
        onClick={toggleOrder}
        appearance='ghost'
        className='relative p-1 hover:bg-current/10'
        aria-label={t('sort.order')}
        border='none'
      >
        <Icon
          name={order === 'desc' ? 'arrowDown' : 'arrowUp'}
          ariaLabel={order === 'desc' ? 'sort descending' : 'sort ascending'}
          size={ICON_SIZES.DEFAULT}
          fill={fill}
        />
      </Button>
    </div>
  );
};
