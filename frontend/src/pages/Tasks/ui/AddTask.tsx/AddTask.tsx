import { useState } from 'react';
import { clsx } from 'clsx';
import { Input } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { COLORS, Icon } from '@shared/ui/Icon';

interface TaskOptions {
  title: string;
  date?: string;
}

export const AddTask = () => {
  const [value, setValue] = useState<TaskOptions>({ title: '', date: '' });

  const handleValueTitle: React.ChangeEventHandler<HTMLInputElement> = e => {
    setValue({ ...value, title: e.target.value });
  };

  const handleValueDate: React.ChangeEventHandler<HTMLInputElement> = e => {
    setValue({ ...value, date: e.target.value });
  };

  const handleClick = () => {
    setValue({ title: '', date: '' });
  };

  const baseWrapperContainerStyles =
    'shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-grey-light justify-between gap-2 p-2 rounded grid';

  const inputStyles = 'min-w-0 outline-0';

  return (
    <>
      <Input
        value={value.title}
        onChange={handleValueTitle}
        placeholder='Добавить задачу'
        type='text'
        containerClassName={clsx(
          baseWrapperContainerStyles,
          'bg-white grid-cols-[auto_1fr]',
        )}
        leftContent={
          <Button appearance='ghost'>
            <Icon name='plus' stroke={COLORS.ACCENT} />
          </Button>
        }
        className={inputStyles}
      />
      <Input
        type='text'
        placeholder='Дата выполнения'
        value={value.date}
        onChange={handleValueDate}
        containerClassName={clsx(
          baseWrapperContainerStyles,
          'grid-cols-[auto_1fr_auto]',
        )}
        className={inputStyles}
        leftContent={
          <Button appearance='ghost'>
            <Icon name='calendar' stroke={COLORS.ACCENT} />
          </Button>
        }
        rightContent={
          <Button onClick={handleClick} appearance='secondary'>
            Добавить
          </Button>
        }
      />
    </>
  );
};
