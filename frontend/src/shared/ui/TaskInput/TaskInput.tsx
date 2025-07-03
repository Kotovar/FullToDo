import { useId, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Button, Input, Icon } from '@shared/ui';
import { ICONS, styles, TaskInputProps } from './utils';
import { useDarkMode } from '@shared/lib';

export const TaskInput = ({
  label,
  value,
  className = '',
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
  const { fill } = useDarkMode();

  const handleOpenCalendar = () => {
    inputRef.current?.showPicker();
  };

  const isDate = useMemo(() => type === 'date', [type]);

  const handleButtonClick = isDate ? handleOpenCalendar : onClick;

  const rightContent =
    variant === 'add-task' && isDate ? (
      <Button onClick={onClick} appearance='primary' padding='s'>
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
          [styles.addTaskDate]: variant === 'add-task' && isDate,
        },
        'p-2',
        className,
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
        ref={isDate ? inputRef : null}
        className={clsx(styles.input, {
          [styles.dateInput]: isDate,
        })}
        leftContent={
          <Button
            appearance='ghost'
            padding='s'
            onClick={handleButtonClick}
            aria-label={label}
          >
            <Icon name={ICONS[type]} stroke={fill} />
          </Button>
        }
        rightContent={rightContent}
      />
    </div>
  );
};
