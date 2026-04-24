import { memo, useId, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { Button, Icon, Input } from '@shared/ui';
import { useDarkMode } from '@shared/lib';
import { DatePickerPopover } from './DatePickerPopover';
import { styles, ICONS, type TaskInputProps } from './utils';
import { useDateInput } from './useDateInput';
import './TaskInput.css';

export const TaskInput = memo((props: TaskInputProps) => {
  const {
    label,
    value,
    className = '',
    variant = 'add-subtask',
    type = 'text',
    placeholder = label,
    onChange,
    onClick,
    onKeyDown,
  } = props;
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { fill } = useDarkMode();
  const isDate = type === 'date';
  const {
    isCalendarOpen,
    calendarPosition,
    selectedDate,
    month,
    displayValue,
    setMonth,
    toggleCalendar,
    handleDateKeyDown,
    handleDateSelect,
    handleClearDate,
    handleToday,
  } = useDateInput({
    isDate,
    value,
    inputRef,
    containerRef: datePickerRef,
    onChange,
  });

  const rightContent =
    variant === 'add-task' && isDate ? (
      <Button onClick={onClick} padding='md'>
        {t('add')}
      </Button>
    ) : null;

  const leftContent = useMemo(
    () => (
      <Button
        appearance='ghost'
        padding='md'
        onClick={isDate ? toggleCalendar : onClick}
        aria-label={label}
        className='focus-visible:outline-dark'
      >
        <Icon name={ICONS[type]} stroke={fill} />
      </Button>
    ),
    [fill, isDate, label, onClick, toggleCalendar, type],
  );

  return (
    <div
      className={clsx(
        {
          [styles.addSubtask]: variant === 'add-subtask',
          [styles.addTask]: variant === 'add-task',
          [styles.addTaskText]: variant === 'add-task' && type === 'text',
          [styles.addTaskDate]: variant === 'add-task' && isDate,
        },
        'relative p-2',
        className,
      )}
      ref={isDate ? datePickerRef : undefined}
    >
      <label htmlFor={inputId} className='sr-only'>
        {label}
      </label>

      <Input
        type={isDate ? 'text' : type}
        id={inputId}
        placeholder={placeholder}
        value={displayValue}
        onChange={isDate ? undefined : onChange}
        onKeyDown={isDate ? handleDateKeyDown : onKeyDown}
        onClick={isDate ? toggleCalendar : undefined}
        ref={inputRef}
        readOnly={isDate}
        className={clsx(styles.input, {
          [styles.dateInput]: isDate,
        })}
        leftContent={leftContent}
        rightContent={rightContent}
      />

      {isDate && isCalendarOpen ? (
        <DatePickerPopover
          month={month}
          selectedDate={selectedDate}
          position={calendarPosition}
          onMonthChange={setMonth}
          onSelect={handleDateSelect}
          onClear={handleClearDate}
          onToday={handleToday}
        />
      ) : null}
    </div>
  );
});
