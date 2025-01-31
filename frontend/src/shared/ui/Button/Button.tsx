import type { ComponentProps } from 'react';
import { clsx } from 'clsx';

type ButtonAppearance = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ComponentProps<'button'> {
  appearance: ButtonAppearance;
  className?: string;
}

export const Button = (props: ButtonProps) => {
  const { appearance = 'primary', className, children, ...rest } = props;

  const baseStyles = 'rounded p-2';
  const variantStyles: Record<ButtonAppearance, string> = {
    primary: 'bg-accent hover:bg-accent-lighter text-white',
    secondary:
      'hover:bg-accent-light bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]',
    ghost: '',
  };

  return (
    <button
      type='button'
      className={clsx(baseStyles, variantStyles[appearance], className)}
      {...rest}
    >
      {children}
    </button>
  );
};
