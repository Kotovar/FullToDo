import { memo } from 'react';
import { COLORS, Icon } from '@shared/ui';

export const MenuButton = memo(({ onClick }: { onClick: () => void }) => (
  <button
    type='button'
    className='hover:border-accent-light flex items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
    onClick={onClick}
    aria-label='Открыть меню'
  >
    <Icon name='burger' fill={COLORS.WHITE} size={32} />
  </button>
));
