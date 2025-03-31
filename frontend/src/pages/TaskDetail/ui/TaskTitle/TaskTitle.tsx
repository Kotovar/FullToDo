import { Input } from '@shared/ui';

interface TaskTitleProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TaskTitle = ({ value, onChange }: TaskTitleProps) => (
  <h1>
    <Input
      type='text'
      value={value}
      onChange={onChange}
      className='p-2 outline-0'
    />
  </h1>
);
