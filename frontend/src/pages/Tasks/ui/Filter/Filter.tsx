import { COLORS, Icon } from '@shared/ui/Icon';

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
        <Icon name='filter' size={32} stroke={COLORS.ACCENT} />
      </div>
    </>
  );
};
