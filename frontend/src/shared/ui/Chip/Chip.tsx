import type { ComponentPropsWithRef } from 'react';
import { Button, COLORS, Icon } from '..';

export interface ChipProps extends ComponentPropsWithRef<'div'> {
  label: string;
  onDelete: () => void;
}

export const Chip = (props: ChipProps) => {
  const { label, onDelete, ...rest } = props;

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
        aria-label={`Удалить ${label}`}
      >
        <Icon name='cross' fill={COLORS.ACCENT} />
      </Button>
    </div>
  );
};
