import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

export interface PProps extends ComponentPropsWithoutRef<'p'> {
  size?: 's' | 'm' | 'l';
}

export const P = ({ size = 'm', children, ...props }: PProps) => {
  return (
    <p
      className={clsx('', {
        ['text-sm']: size === 's',
        ['text-base']: size === 'm',
        ['text-lg']: size === 'l',
      })}
      {...props}
    >
      {children}
    </p>
  );
};
