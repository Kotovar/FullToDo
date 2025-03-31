import clsx from 'clsx';
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
}: DateInputProps) => (
  <div className={clsx(STYLES.baseWrapper, 'grid-cols-[auto_1fr_auto]')}>
    <label htmlFor='due-date-external' className='sr-only'>
      {label}
    </label>

    <Input
      type='date'
      id='due-date-external'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={clsx(STYLES.input, 'w-fit')}
      leftContent={
        <Button appearance='ghost' padding='s'>
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
