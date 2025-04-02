import { useParams } from 'react-router';
import { useState } from 'react';
import { TaskOptions } from '@pages/Tasks/lib';
import { DateInput } from './DateInput';
import { TaskInput } from './TaskInput';
import { useTasks } from '@entities/Task';

export const AddTask = () => {
  const { notepadId = '' } = useParams();
  const [value, setValue] = useState<TaskOptions>({
    title: '',
    date: '',
  });
  const { methods } = useTasks(notepadId);

  const setValueDefault = () => setValue({ title: '', date: '' });

  const handleValueChange =
    (field: keyof TaskOptions) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = () => {
    if (!value.title.trim()) return;

    methods.createTask({
      title: value.title,
      dueDate: value?.date ? new Date(value?.date) : undefined,
    });

    setValueDefault();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <fieldset className='flex flex-col gap-2'>
      <legend className='sr-only'>Создание задачи</legend>

      <TaskInput
        value={value.title}
        label='Добавить задачу'
        onChange={handleValueChange('title')}
        onClick={handleSubmit}
        onKeyDown={handleKeyDown}
      />

      <DateInput
        value={value.date}
        label='Дата выполнения'
        onChange={handleValueChange('date')}
        onClick={handleSubmit}
      />
    </fieldset>
  );
};
