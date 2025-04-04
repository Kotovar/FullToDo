import { COLORS, Icon, ICON_SIZES } from '@shared/ui';

type Status = 'completed' | 'expired' | 'active' | 'all';

interface FilterProps {
  type?: Status;
}

const status: Record<Status, string> = {
  completed: 'Выполненные',
  expired: 'Просроченные',
  active: 'Активные',
  all: 'Все',
};

export const Filter = (props: FilterProps) => {
  const { type = 'active' } = props;

  return (
    <>
      <div className='flex items-center justify-center gap-2'>
        {status[type]}
        <button aria-label='Сменить фильтр' className='cursor-pointer'>
          <Icon
            name='filter'
            size={ICON_SIZES.FILTERS}
            stroke={COLORS.ACCENT}
          />
        </button>
      </div>
    </>
  );
};
