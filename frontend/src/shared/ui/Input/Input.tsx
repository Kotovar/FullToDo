import type { ComponentProps } from 'react';
import { clsx } from 'clsx';
import { COLORS, Icon } from '../Icon';
import { IconName } from '@shared/config';

export interface InputProps extends ComponentProps<'input'> {
  iconName?: IconName;
  type: 'text' | 'data';
  containerClassName?: string;
  handleClick?: () => void;
}

export const Input = (props: InputProps) => {
  const { handleClick, containerClassName, type, iconName, ...rest } = props;

  const baseStyles = 'w-full p-2';

  return (
    <div className={clsx(baseStyles, containerClassName)}>
      <button type='button' onClick={handleClick}>
        {iconName && <Icon name={iconName} stroke={COLORS.ACCENT} />}
      </button>
      <input type={type} {...rest} />
    </div>
  );
};
