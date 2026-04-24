import {
  type ChangeEvent,
  type KeyboardEventHandler,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useOnClickOutside } from 'usehooks-ts';
import {
  formatDateLabel,
  formatDateValue,
  getCalendarPosition,
  parseDateValue,
  type CalendarPosition,
} from './utils';

interface UseDateInputParams {
  isDate: boolean;
  value?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useDateInput = ({
  isDate,
  value,
  inputRef,
  containerRef,
  onChange,
}: UseDateInputParams) => {
  const { i18n } = useTranslation();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarPosition, setCalendarPosition] =
    useState<CalendarPosition>('bottom');
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const [month, setMonth] = useState<Date>(selectedDate ?? new Date());

  useOnClickOutside(containerRef as RefObject<HTMLElement>, () => {
    setIsCalendarOpen(false);
  });

  useEffect(() => {
    if (!isDate || !isCalendarOpen) return;

    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isCalendarOpen, isDate]);

  const emitDateChange = useCallback(
    (nextValue: string) => {
      onChange({
        target: { value: nextValue },
      } as ChangeEvent<HTMLInputElement>);
    },
    [onChange],
  );

  const openCalendar = useCallback(() => {
    const rect = inputRef.current?.getBoundingClientRect();

    if (rect) {
      setCalendarPosition(getCalendarPosition(rect));
    }

    setMonth(selectedDate ?? new Date());
    setIsCalendarOpen(true);
    inputRef.current?.focus();
  }, [inputRef, selectedDate]);

  const toggleCalendar = useCallback(() => {
    if (isCalendarOpen) {
      setIsCalendarOpen(false);
      return;
    }

    openCalendar();
  }, [isCalendarOpen, openCalendar]);

  const handleDateSelect = useCallback(
    (date?: Date) => {
      emitDateChange(date ? formatDateValue(date) : '');
      setIsCalendarOpen(false);
    },
    [emitDateChange],
  );

  const handleToday = useCallback(() => {
    const today = new Date();

    setMonth(today);
    emitDateChange(formatDateValue(today));
    setIsCalendarOpen(false);
  }, [emitDateChange]);

  const handleClearDate = useCallback(() => {
    emitDateChange('');
    setIsCalendarOpen(false);
  }, [emitDateChange]);

  const handleDateKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCalendar();
      }
    },
    [toggleCalendar],
  );

  const displayValue =
    isDate && selectedDate
      ? formatDateLabel(selectedDate, i18n.resolvedLanguage ?? 'en')
      : value;

  return {
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
  };
};
