import { useState, type ComponentPropsWithoutRef } from 'react';
import { COLORS, Icon } from '../Icon';
import { IconName } from '@shared/config';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  iconName?: IconName;
}

export const Input = ({ iconName, ...rest }: InputProps) => {
  const [value, setValue] = useState<string>('');

  const handleValue: React.ChangeEventHandler<HTMLInputElement> = e => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    setValue('');
  };

  return (
    <div className='flex items-center gap-2 p-1'>
      <button type='button' onClick={handleClick}>
        {iconName && <Icon name={iconName} stroke={COLORS.ACCENT} />}
      </button>
      <input
        value={value}
        onChange={handleValue}
        type='text'
        className='outline-0'
        {...rest}
      />
    </div>
  );
};
