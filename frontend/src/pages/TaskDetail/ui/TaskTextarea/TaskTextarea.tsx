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
    <textarea
      className='outline-bg-second bg-light placeholder:text-grey scroll-tasks scrollbar-tasks max-h-[5lh] min-h-[3lh] w-full rounded-sm p-2'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      id='description'
      rows={3}
    />
  </div>
);
