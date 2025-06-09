import { useRef, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useOnClickOutside } from 'usehooks-ts';
import { SortState } from '@pages/Tasks/lib';
import { commonLabels } from './constants';

interface SortMenuProps {
  buttonRef: RefObject<HTMLButtonElement | null>;
  closeMenu: () => void;
  onApply: (sort: SortState) => void;
}

export const SortMenu = ({ buttonRef, closeMenu, onApply }: SortMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useOnClickOutside(
    [ref as RefObject<HTMLElement>, buttonRef as RefObject<HTMLElement>],
    closeMenu,
  );

  const handleSubmit = (e: React.FormEvent, sort: SortState) => {
    e.preventDefault();
    onApply(sort);
    closeMenu();
  };

  type Entries<T> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T][];

  const sortGroups = Object.entries(commonLabels) as Entries<
    typeof commonLabels
  >;

  return (
    <div
      className='border-bg-dark bg-light absolute top-full flex w-max flex-col items-center rounded-md border p-2 shadow-md md:left-0'
      ref={ref}
    >
      <form className='flex flex-col items-end text-base'>
        {sortGroups.map(([sort, label]) => (
          <span
            className='cursor-pointer px-2 hover:rounded hover:bg-current/10'
            key={sort}
            onClick={e => handleSubmit(e, sort)}
          >
            {t(label)}
          </span>
        ))}
      </form>
    </div>
  );
};
