import {
  memo,
  type ComponentPropsWithRef,
  type HTMLInputTypeAttribute,
  type JSX,
} from 'react';

export interface InputProps extends ComponentPropsWithRef<'input'> {
  type: HTMLInputTypeAttribute;
  leftContent?: JSX.Element | null;
  rightContent?: JSX.Element | null;
}

export const Input = memo((props: InputProps) => {
  const { leftContent, rightContent, type, ...rest } = props;

  return (
    <>
      {leftContent}
      <input type={type} {...rest} />
      {rightContent}
    </>
  );
});
