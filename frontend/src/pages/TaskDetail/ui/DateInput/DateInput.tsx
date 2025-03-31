import { Button, COLORS, Icon, Input } from '@shared/ui';

interface DateInputProps {
  value?: string;
  label: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateInput = ({
  value,
  label,
  onChange,
  placeholder = label,
}: DateInputProps) => (
  <div className={'flex items-center gap-2 p-1'}>
    <label htmlFor='due-date-external' className='sr-only'>
      {label}
    </label>

    <Input
      type='date'
      id='due-date-external'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={'w-fit outline-0'}
      leftContent={
        <Button appearance='ghost' padding='s'>
          <Icon name='calendar' stroke={COLORS.ACCENT} />
        </Button>
      }
    />
  </div>
);
