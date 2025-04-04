import { Button, COLORS, Icon, Input } from '@shared/ui';
import { useRef } from 'react';

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
}: DateInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenCalendar = () => {
    inputRef.current?.showPicker();
  };

  return (
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
        ref={inputRef}
        className={'w-fit [&::-webkit-calendar-picker-indicator]:hidden'}
        leftContent={
          <Button
            appearance='ghost'
            padding='s'
            onClick={handleOpenCalendar}
            aria-label='Выбрать дату из календаря'
          >
            <Icon name='calendar' stroke={COLORS.ACCENT} />
          </Button>
        }
      />
    </div>
  );
};
