import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { DayPicker } from 'react-day-picker';
import { enUS, ru } from 'react-day-picker/locale';
import { clsx } from 'clsx';
import { Button } from '@shared/ui';
import type { CalendarPosition } from './utils';

interface DatePickerPopoverProps {
  month: Date;
  selectedDate?: Date;
  position: CalendarPosition;
  onMonthChange: (date: Date) => void;
  onSelect: (date?: Date) => void;
  onClear: () => void;
  onToday: () => void;
}

export const DatePickerPopover = memo(
  ({
    month,
    selectedDate,
    position,
    onMonthChange,
    onSelect,
    onClear,
    onToday,
  }: DatePickerPopoverProps) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === 'ru' ? ru : enUS;

    return (
      <div
        className={clsx(
          'task-date-picker border-bg-dark bg-light absolute left-0 z-30 rounded-xl border p-3 shadow-lg',
          position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
        )}
        role='dialog'
        aria-label={t('tasks.calendar.dialog')}
      >
        <DayPicker
          animate
          mode='single'
          locale={locale}
          month={month}
          onMonthChange={onMonthChange}
          selected={selectedDate}
          onSelect={onSelect}
          navLayout='around'
          className='text-dark'
        />
        <div className='mt-2 flex justify-between gap-2'>
          <Button
            appearance='ghost'
            padding='sm'
            onClick={onClear}
            className='hover:bg-bg-second'
          >
            {t('tasks.calendar.clear')}
          </Button>
          <Button padding='sm' onClick={onToday}>
            {t('tasks.calendar.today')}
          </Button>
        </div>
      </div>
    );
  },
);
