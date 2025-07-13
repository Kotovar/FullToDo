import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, COLORS, Icon } from '@shared/ui';

interface MenuButtonProps {
  onClick: () => void;
}

export const MenuButton = memo(({ onClick }: MenuButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      onClick={onClick}
      aria-label={t('change.menu')}
      className='hover:border-light rounded-xl'
      padding='sm'
      appearance='ghost'
    >
      <Icon name='burger' fill={COLORS.WHITE} size={32} />
    </Button>
  );
});
