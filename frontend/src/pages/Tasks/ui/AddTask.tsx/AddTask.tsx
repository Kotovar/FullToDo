import { useState } from 'react';
import { COLORS, Icon } from '@shared/ui/Icon';
import { Input } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';

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

  return (
    <>
      <div className='flex gap-2 bg-white p-4 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
        <Input
          value={value.date}
          onChange={handleValueDate}
          placeholder='Добавить задачу'
          type='text'
          iconName='plus'
        />
      </div>
      <div className='bg-grey-light flex items-center gap-2 p-4 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
        <Icon name='calendar' size={32} stroke={COLORS.ACCENT} />
        <input
          className='w-full outline-0'
          type='datetime-local'
          placeholder='Дата выполнения'
          value={value.title}
          onChange={handleValueTitle}
        />
        <Button onClick={handleClick} appearance='ghost'>
          Добавить
        </Button>
      </div>
    </>
  );
};
