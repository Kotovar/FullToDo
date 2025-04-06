import { useRef } from 'react';
import clsx from 'clsx';
import { Button, COLORS, Icon, Input } from '@shared/ui';

type InputType = 'text' | 'date';

interface TaskInputProps {
  type?: InputType;
  value?: string;
  label: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const TaskInput = ({
  type = 'text',
  value,
  label,
  placeholder,
  onChange,
  onClick,
  onKeyDown,
}: TaskInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `${type}-input`;

  const handleOpenCalendar = () => {
    inputRef.current?.showPicker();
  };

  const iconName = type === 'date' ? 'calendar' : 'plus';
  const handleButtonClick = type === 'date' ? handleOpenCalendar : onClick;

  return (
    <div className='flex items-center gap-2 p-1'>
      <label htmlFor={inputId} className='sr-only'>
        {label}
      </label>

      <Input
        type={type}
        id={inputId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        ref={type === 'date' ? inputRef : null}
        className={clsx('w-full outline-0', {
          'w-fit [&::-webkit-calendar-picker-indicator]:hidden':
            type === 'date',
        })}
        leftContent={
          <Button
            appearance='ghost'
            padding='s'
            onClick={handleButtonClick}
            aria-label={label}
          >
            <Icon name={iconName} stroke={COLORS.ACCENT} />
          </Button>
        }
      />
    </div>
  );
};
