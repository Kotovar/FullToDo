import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, COLORS, Icon } from '@shared/ui';

export const MenuButton = memo(({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();

  return (
    <Button
      onClick={onClick}
      aria-label={t('change.menu')}
      className='hover:border-light rounded-xl border-1 border-transparent p-1'
      appearance='ghost'
    >
      <Icon name='burger' fill={COLORS.WHITE} size={32} />
    </Button>
  );
});
