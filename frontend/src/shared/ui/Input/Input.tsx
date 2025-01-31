import type { ComponentProps, JSX } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends ComponentProps<'input'> {
  type: 'text' | 'data';
  containerClassName?: string;
  leftContent?: JSX.Element;
  rightContent?: JSX.Element;
}

export const Input = (props: InputProps) => {
  const { leftContent, rightContent, containerClassName, type, ...rest } =
    props;

  const baseStyles = 'w-full';

  return (
    <div className={clsx(baseStyles, containerClassName)}>
      {leftContent}
      <input type={type} {...rest} />
      {rightContent}
    </div>
  );
};
