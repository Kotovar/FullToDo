import { memo, type ComponentPropsWithRef } from 'react';
import { clsx } from 'clsx';

type ButtonAppearance = 'primary' | 'ghost';
type ButtonPadding = 'none' | 'sm' | 'md';
type ButtonBorderWidth = 'none' | 's';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  appearance?: ButtonAppearance;
  padding?: ButtonPadding;
  border?: ButtonBorderWidth;
  className?: string;
}

const BASE_STYLES = 'rounded cursor-pointer border-transparent';
const VARIANT_STYLES: Record<ButtonAppearance, string> = {
  primary: 'bg-accent hover:bg-accent/80 text-white dark:border-dark',
  ghost: 'focus-visible:ring-dark focus:outline-none focus-visible:ring-2',
};

const PADDING_STYLES: Record<ButtonPadding, string> = {
  none: '',
  sm: 'p-1',
  md: 'p-2',
};

const BORDER_STYLES: Record<ButtonBorderWidth, string> = {
  none: '',
  s: 'border-2',
};

export const Button = memo((props: ButtonProps) => {
  const {
    appearance = 'primary',
    padding = 'none',
    border = 's',
    className,
    children,
    ...rest
  } = props;

  return (
    <button
      type='button'
      className={clsx(
        BASE_STYLES,
        VARIANT_STYLES[appearance],
        PADDING_STYLES[padding],
        BORDER_STYLES[border],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
