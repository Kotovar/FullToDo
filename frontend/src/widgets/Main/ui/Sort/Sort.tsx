import SortIconDown from './arrow-down.svg?react';
import SortIconUp from './arrow-up.svg?react';

type Sort = 'date' | 'deadline' | 'priority';

interface Props {
  sort?: Sort;
  direction?: 'up' | 'down';
}

const sortType: Record<Sort, string> = {
  date: 'По дате создания',
  deadline: 'По сроку выполнения',
  priority: 'По приоритету',
};

export const Sort = (props: Props) => {
  const { sort = 'date', direction = 'down' } = props;

  return (
    <div className='flex items-center justify-center gap-2'>
      <button>{sortType[sort]}</button>
      <button>
        {direction === 'down' ? (
          <SortIconDown className='fill-accent h-8 w-8' />
        ) : (
          <SortIconUp className='fill-accent h-8 w-8' />
        )}
      </button>
    </div>
  );
};
