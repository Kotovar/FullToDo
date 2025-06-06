import type { ComponentPropsWithRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, COLORS, Icon } from '..';
import { useDarkMode } from '@shared/lib/hooks';

export interface ChipProps extends ComponentPropsWithRef<'div'> {
  label: string;
  onDelete: () => void;
}

export const Chip = ({ label, onDelete, ...rest }: ChipProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();

  return (
    <div
      {...rest}
      className='bg-light inline-flex items-center self-center rounded-full pl-4 text-sm'
    >
      {label}
      <Button
        appearance='ghost'
        onClick={onDelete}
        padding='s'
        aria-label={`${t('delete')} ${label}`}
      >
        <Icon name='cross' fill={isDarkMode ? COLORS.WHITE : COLORS.ACCENT} />
      </Button>
    </div>
  );
};
