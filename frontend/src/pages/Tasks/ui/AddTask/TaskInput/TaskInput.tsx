import clsx from 'clsx';
import { STYLES } from '@pages/Tasks/lib';
import { Button, COLORS, Icon, Input } from '@shared/ui';

interface TaskInputProps {
  value: string;
  label: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

export const TaskInput = ({
  value,
  label,
  placeholder = label,
  onChange,
  onKeyDown,
  onClick,
}: TaskInputProps) => (
  <div className={clsx(STYLES.baseWrapper, 'grid-cols-[auto_1fr] bg-white')}>
    <label htmlFor='task-input' className='sr-only'>
      {label}
    </label>

    <Input
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      type='text'
      id='task-input'
      leftContent={
        <Button appearance='ghost' padding='s' onClick={onClick}>
          <Icon name='plus' stroke={COLORS.ACCENT} />
        </Button>
      }
      className={STYLES.input}
    />
  </div>
);
