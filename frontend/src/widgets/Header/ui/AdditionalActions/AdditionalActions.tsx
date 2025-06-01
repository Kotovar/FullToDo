import { memo } from 'react';
import { COLORS, Icon } from '@shared/ui';

export const AdditionalActions = memo(() => (
  <nav className='flex gap-x-2' aria-label='Дополнительные действия'>
    <button
      type='button'
      className='hover:border-accent-light flex items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
      aria-label='Сменить язык'
      aria-haspopup='true'
    >
      <Icon name='flagRu' />
      <span className='text-white'>Русский</span>
    </button>
    <button
      type='button'
      className='hover:border-accent-light flex items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
      aria-label='Сменить тему'
    >
      <Icon name='themeLight' fill={COLORS.WHITE} />
    </button>
  </nav>
));
