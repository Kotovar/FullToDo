import { memo } from 'react';

interface TaskTextareaProps {
  label: string;
  value?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TaskTextarea = memo(
  ({ value, label, onChange, placeholder = label }: TaskTextareaProps) => {
    return (
      <div>
        <label htmlFor='description' className='sr-only'>
          {label}
        </label>
        <textarea
          className='outline-bg-second bg-light scrollbar-tasks placeholder:text-grey max-h-[5lh] min-h-16 w-full rounded-sm p-2'
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          id='description'
        />
      </div>
    );
  },
);
