import { useRef } from 'react';
import clsx from 'clsx';
import { Button, COLORS, Icon, Input } from '@shared/ui';

interface AddTaskInputProps {
  label: string;
  type?: 'text' | 'date';
  value?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const styles = {
  baseWrapper:
    'shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-grey-light justify-between gap-2 p-2 rounded grid',
  textWrapper: 'grid-cols-[auto_1fr] bg-white',
  dateWrapper: 'grid-cols-[auto_1fr_auto]',
  input: 'min-w-0 outline-0',
  dateInput: 'w-fit [&::-webkit-calendar-picker-indicator]:hidden',
};

export const AddTaskInput = ({
  label,
  type = 'text',
  value,
  placeholder = label,
  onKeyDown,
  onChange,
  onClick,
}: AddTaskInputProps) => {
  const inputId = type === 'date' ? 'due-date' : 'task-name';
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenCalendar = () => {
    inputRef.current?.showPicker();
  };

  const rightContent =
    type === 'date' ? (
      <Button onClick={onClick} appearance='secondary' padding='s'>
        Добавить
      </Button>
    ) : null;

  return (
    <div
      className={clsx(
        styles.baseWrapper,
        { [styles.textWrapper]: type === 'text' },
        { [styles.dateWrapper]: type === 'date' },
      )}
    >
      <label htmlFor={inputId} className='sr-only'>
        {label}
      </label>

      <Input
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        type={type}
        id={inputId}
        ref={type === 'date' ? inputRef : null}
        className={clsx(styles.input, {
          [styles.dateInput]: type === 'date',
        })}
        leftContent={
          <Button
            appearance='ghost'
            padding='s'
            onClick={type === 'date' ? handleOpenCalendar : onClick}
            aria-label={label}
          >
            <Icon
              name={type === 'date' ? 'calendar' : 'plus'}
              stroke={COLORS.ACCENT}
            />
          </Button>
        }
        rightContent={rightContent}
      />
    </div>
  );
};
