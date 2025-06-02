import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { COLORS, Icon } from '@shared/ui';

export const MenuButton = memo(({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();

  return (
    <button
      type='button'
      className='hover:border-accent-light flex items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
      onClick={onClick}
      aria-label={t('open.menu')}
    >
      <Icon name='burger' fill={COLORS.WHITE} size={32} />
    </button>
  );
});
