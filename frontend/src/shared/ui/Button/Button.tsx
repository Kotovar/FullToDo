import { memo, type ComponentPropsWithRef } from 'react';
import { clsx } from 'clsx';

type ButtonAppearance = 'primary' | 'ghost';
type ButtonPadding = 'none' | 's';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  appearance?: ButtonAppearance;
  padding?: ButtonPadding;
  className?: string;
}

export const Button = memo((props: ButtonProps) => {
  const {
    appearance = 'primary',
    padding = 'none',
    className,
    children,
    ...rest
  } = props;
  const baseStyles = 'rounded cursor-pointer';

  const variantStyles: Record<ButtonAppearance, string> = {
    primary:
      'bg-accent hover:bg-accent/80 text-white dark:border-dark border-1',
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
});
