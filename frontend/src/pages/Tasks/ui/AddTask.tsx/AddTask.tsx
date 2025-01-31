import { useState } from 'react';
import { clsx } from 'clsx';
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

  const baseStyles = 'flex p-2 rounded shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]';

  return (
    <>
      <div className={clsx(baseStyles, 'bg-white')}>
        <Input
          value={value.title}
          onChange={handleValueTitle}
          handleClick={handleClick}
          placeholder='Добавить задачу'
          type='text'
          iconName='plus'
          containerClassName='grid grid-cols-[2rem_1fr] overflow-hidden'
          className='min-w-0 outline-0'
        />
      </div>
      <div className={clsx(baseStyles, 'bg-grey-light justify-between')}>
        <Input
          type='text'
          placeholder='Дата выполнения'
          value={value.date}
          onChange={handleValueDate}
          iconName='calendar'
          containerClassName='grid grid-cols-[2rem_1fr] overflow-hidden'
          className='min-w-0 outline-0'
        />
        <Button onClick={handleClick} appearance='secondary'>
          Добавить
        </Button>
      </div>
    </>
  );
};
