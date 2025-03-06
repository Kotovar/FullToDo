import type { ComponentPropsWithoutRef } from 'react';

export type TextareaProps = ComponentPropsWithoutRef<'textarea'>;

export const Textarea = ({ ...rest }: TextareaProps) => {
  return (
    <div className='w-full p-2'>
      <textarea {...rest} />
    </div>
  );
};
