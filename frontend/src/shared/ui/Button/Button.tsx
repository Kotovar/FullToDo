import { memo, type ComponentPropsWithRef } from 'react';
import { clsx } from 'clsx';

type ButtonAppearance = 'primary' | 'ghost';
type ButtonPadding = 'none' | 's';
type ButtonBorderWidth = 'none' | 's';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  appearance?: ButtonAppearance;
  padding?: ButtonPadding;
  border?: ButtonBorderWidth;
  className?: string;
}

export const Button = memo((props: ButtonProps) => {
  const {
    appearance = 'primary',
    padding = 'none',
    border = 's',
    className,
    children,
    ...rest
  } = props;
  const baseStyles = 'rounded cursor-pointer border-transparent';

  const variantStyles: Record<ButtonAppearance, string> = {
    primary: 'bg-accent hover:bg-accent/80 text-white dark:border-dark ',
    ghost: 'focus-visible:ring-dark focus:outline-none focus-visible:ring-2',
  };

  const paddingStyles: Record<ButtonPadding, string> = {
    none: 'p-0',
    s: 'p-2',
  };
  const borderStyles: Record<ButtonBorderWidth, string> = {
    none: 'border-0',
    s: 'border-2',
  };

  return (
    <button
      type='button'
      className={clsx(
        baseStyles,
        variantStyles[appearance],
        paddingStyles[padding],
        borderStyles[border],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
