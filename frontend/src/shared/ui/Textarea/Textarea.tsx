import { ComponentPropsWithoutRef } from 'react';

export type TextareaProps = ComponentPropsWithoutRef<'textarea'>;

export const Textarea = ({ ...rest }: TextareaProps) => {
  return (
    <div className=''>
      <textarea {...rest} className='w-full p-2' />
    </div>
  );
};
