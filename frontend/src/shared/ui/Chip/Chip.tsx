import { useTranslation } from 'react-i18next';
import { memo, type ComponentPropsWithRef } from 'react';
import { Button, Icon } from '@shared/ui';
import { useDarkMode } from '@shared/lib/hooks';

export interface ChipProps extends ComponentPropsWithRef<'div'> {
  label: string;
  onDelete: () => void;
}

export const Chip = memo(({ label, onDelete }: ChipProps) => {
  const { t } = useTranslation();
  const { fill } = useDarkMode();

  return (
    <div className='bg-light inline-flex items-center self-center rounded-full pl-4 text-sm'>
      {label}
      <Button
        appearance='ghost'
        onClick={onDelete}
        padding='md'
        aria-label={`${t('delete')} ${label}`}
      >
        <Icon name='cross' fill={fill} />
      </Button>
    </div>
  );
});
