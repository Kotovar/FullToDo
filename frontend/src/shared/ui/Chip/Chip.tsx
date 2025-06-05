import type { ComponentPropsWithRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, COLORS, Icon } from '..';

export interface ChipProps extends ComponentPropsWithRef<'div'> {
  label: string;
  onDelete: () => void;
}

export const Chip = ({ label, onDelete, ...rest }: ChipProps) => {
  const { t } = useTranslation();

  return (
    <div
      {...rest}
      className='inline-flex items-center self-center rounded-full bg-neutral-100 pl-4 text-sm'
    >
      {label}
      <Button
        appearance='ghost'
        onClick={onDelete}
        padding='s'
        aria-label={`${t('delete')} ${label}`}
      >
        <Icon name='cross' fill={COLORS.ACCENT} />
      </Button>
    </div>
  );
};
