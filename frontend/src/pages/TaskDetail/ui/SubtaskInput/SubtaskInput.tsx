import { Button, COLORS, Icon, Input } from '@shared/ui';

interface SubtaskInputProps {
  value: string;
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

export const SubtaskInput = ({
  value,
  label,
  placeholder,
  onChange,
  onKeyDown,
  onClick,
}: SubtaskInputProps) => (
  <div className='flex items-center gap-2 p-1'>
    <label htmlFor='subtask-input' className='sr-only'>
      {label}
    </label>

    <Input
      placeholder={placeholder}
      type='text'
      id='subtask-input'
      className='w-full outline-0'
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      leftContent={
        <Button
          appearance='ghost'
          onClick={onClick}
          padding='s'
          aria-label='Добавить подзадачу'
        >
          <Icon name='plus' stroke={COLORS.ACCENT} />
        </Button>
      }
    />
  </div>
);
