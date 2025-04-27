import { COLORS, Icon, ICON_SIZES } from '@shared/ui';

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
      {sortType[sort]}
      <button aria-label='Сменить сортировку' className='cursor-pointer'>
        <Icon
          name={direction === 'down' ? 'arrowDown' : 'arrowUp'}
          ariaLabel={
            direction === 'down' ? 'sort descending' : 'sort ascending'
          }
          size={ICON_SIZES.FILTERS}
          fill={COLORS.ACCENT}
        />
      </button>
    </div>
  );
};
