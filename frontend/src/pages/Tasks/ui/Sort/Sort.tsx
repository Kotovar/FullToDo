import { COLORS, Icon } from '@shared/ui';

type Sort = 'date' | 'deadline' | 'priority';

interface SortProps {
  sort?: Sort;
  direction?: 'up' | 'down';
}

const sortType: Record<Sort, string> = {
  date: 'По дате создания',
  deadline: 'По сроку выполнения',
  priority: 'По приоритету',
};

export const Sort = (props: SortProps) => {
  const { sort = 'date', direction = 'down' } = props;

  return (
    <div className='flex items-center justify-center gap-2'>
      <button>{sortType[sort]}</button>
      <button>
        {direction === 'down' ? (
          <Icon name='arrowDown' size={32} fill={COLORS.ACCENT} />
        ) : (
          <Icon name='arrowUp' size={32} fill={COLORS.ACCENT} />
        )}
      </button>
    </div>
  );
};
