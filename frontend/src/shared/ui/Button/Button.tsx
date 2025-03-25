import type { ComponentPropsWithRef } from 'react';
import { clsx } from 'clsx';

type ButtonAppearance = 'primary' | 'secondary' | 'ghost';
type ButtonPadding = 'none' | 's';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  appearance: ButtonAppearance;
  padding?: ButtonPadding;
  className?: string;
}

export const Button = (props: ButtonProps) => {
  const {
    appearance = 'primary',
    padding = 's',
    className,
    children,
    ...rest
  } = props;

  const baseStyles = 'rounded cursor-pointer';

  const variantStyles: Record<ButtonAppearance, string> = {
    primary: 'bg-accent hover:bg-accent-lighter text-white',
    secondary:
      'hover:bg-accent-light bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]',
    ghost: '',
  };

  const paddingStyles: Record<ButtonPadding, string> = {
    none: 'p-0',
    s: 'p-2',
  };

  return (
    <button
      type='button'
      className={clsx(
        baseStyles,
        variantStyles[appearance],
        paddingStyles[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
