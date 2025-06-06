import { useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Button, Input, COLORS, Icon } from '@shared/ui';
import { ICONS, styles, TaskInputProps } from './utils';

export const TaskInput = ({
  label,
  value,
  variant = 'add-subtask',
  type = 'text',
  placeholder = label,
  onChange,
  onClick,
  onKeyDown,
}: TaskInputProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleOpenCalendar = () => {
    inputRef.current?.showPicker();
  };

  const handleButtonClick = type === 'date' ? handleOpenCalendar : onClick;

  const rightContent =
    variant === 'add-task' && type === 'date' ? (
      <Button
        onClick={onClick}
        appearance='primary'
        padding='s'
        className='dark:border-dark border-1'
      >
        {t('add')}
      </Button>
    ) : null;

  return (
    <div
      className={clsx(
        {
          [styles.addSubtask]: variant === 'add-subtask',
          [styles.addTask]: variant === 'add-task',
          [styles.addTaskText]: variant === 'add-task' && type === 'text',
          [styles.addTaskDate]: variant === 'add-task' && type === 'date',
        },
        'p-2',
      )}
    >
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
        className={clsx(styles.input, {
          [styles.dateInput]: type === 'date',
        })}
        leftContent={
          <Button
            appearance='ghost'
            padding='s'
            onClick={handleButtonClick}
            aria-label={label}
          >
            <Icon name={ICONS[type]} stroke={COLORS.ACCENT} />
          </Button>
        }
        rightContent={rightContent}
      />
    </div>
  );
};
