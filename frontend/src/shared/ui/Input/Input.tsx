import type { ComponentPropsWithRef, JSX } from 'react';

export interface InputProps extends ComponentPropsWithRef<'input'> {
  type: 'text' | 'date';
  leftContent?: JSX.Element | null;
  rightContent?: JSX.Element | null;
}

export const Input = (props: InputProps) => {
  const { leftContent, rightContent, type, ...rest } = props;

  return (
    <>
      {leftContent}
      <input type={type} {...rest} />
      {rightContent}
    </>
  );
};
