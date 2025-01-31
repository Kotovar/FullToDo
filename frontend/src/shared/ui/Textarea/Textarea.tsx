import type { ComponentProps } from 'react';

export type TextareaProps = ComponentProps<'textarea'>;

export const Textarea = ({ ...rest }: TextareaProps) => {
  return (
    <div className=''>
      <textarea {...rest} className='w-full p-2' />
    </div>
  );
};
