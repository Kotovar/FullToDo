import type { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  appearance: 'primary' | 'ghost';
  arrow?: 'right' | 'down' | 'none';
}

export const Button = ({ appearance, children, ...rest }: ButtonProps) => {
  return (
    <button
      type='button'
      className={clsx('', {
        ['bg-accent hover:bg-accent-lighter rounded px-4 py-2 text-white']:
          appearance === 'primary',
        ['hover:bg-accent-light rounded-lg bg-white px-4 py-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]']:
          appearance === 'ghost',
      })}
      {...rest}
    >
      {children}
    </button>
  );
};
