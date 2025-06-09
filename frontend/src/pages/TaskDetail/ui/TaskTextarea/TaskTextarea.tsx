import { Textarea } from '@shared/ui';

interface TaskTextareaProps {
  value?: string;
  label: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TaskTextarea = ({
  value,
  label,
  onChange,
  placeholder = label,
}: TaskTextareaProps) => (
  <div>
    <label htmlFor='description' className='sr-only'>
      {label}
    </label>
    <Textarea
      className='outline-bg-second bg-light placeholder:text-grey w-full rounded-sm p-2'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      id='description'
      autoCapitalize='sentences'
    />
  </div>
);
