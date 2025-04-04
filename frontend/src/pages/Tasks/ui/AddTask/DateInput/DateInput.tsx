import clsx from 'clsx';
import { useRef } from 'react';
import { STYLES } from '@pages/Tasks/lib';
import { Button, COLORS, Icon, Input } from '@shared/ui';

interface DateInputProps {
  label: string;
  value?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
}

export const DateInput = ({
  value,
  label,
  placeholder = label,
  onChange,
  onClick,
}: DateInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenCalendar = () => {
    inputRef.current?.showPicker();
  };

  return (
    <div className={clsx(STYLES.baseWrapper, 'grid-cols-[auto_1fr_auto]')}>
      <label htmlFor='due-date-external' className='sr-only'>
        {label}
      </label>

      <Input
        type='date'
        id='due-date-external'
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={clsx(
          STYLES.input,
          'w-fit [&::-webkit-calendar-picker-indicator]:hidden',
        )}
        leftContent={
          <Button
            appearance='ghost'
            padding='s'
            aria-label='Выбрать дату из календаря'
            onClick={handleOpenCalendar}
          >
            <Icon name='calendar' stroke={COLORS.ACCENT} />
          </Button>
        }
        rightContent={
          <Button onClick={onClick} appearance='secondary' padding='s'>
            Добавить
          </Button>
        }
      />
    </div>
  );
};
