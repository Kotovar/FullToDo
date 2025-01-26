import FilterIcon from './task-filter.svg?react';

type Status = 'completed' | 'expired' | 'active' | 'all';

interface Props {
  type?: Status;
}

const status: Record<Status, string> = {
  completed: 'Выполненные',
  expired: 'Просроченные',
  active: 'Активные',
  all: 'Все',
};

export const Filter = (props: Props) => {
  const { type = 'active' } = props;

  return (
    <>
      <div className='flex items-center justify-center gap-2'>
        <button>{status[type]}</button>
        <FilterIcon className='stroke-accent h-8 w-8' />
      </div>
    </>
  );
};
