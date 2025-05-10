import { useParams } from 'react-router';
import { useState } from 'react';
import { useTasks } from '@entities/Task';
import type { TaskOptions } from '@pages/Tasks/lib';
import { TaskInput } from '@shared/ui';
import { useNotifications } from '@shared/lib/notifications';
import { getSuccessMessage } from '@shared/api';

export const AddTask = () => {
  const { notepadId = '' } = useParams();
  const [value, setValue] = useState<TaskOptions>({
    title: '',
    date: '',
  });

  const { showSuccess, showError } = useNotifications();
  const { methods } = useTasks({
    notepadId,
    onSuccess: method => showSuccess(getSuccessMessage('tasks', method)),
    onError: error => showError(error.message),
  });

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

    setValue({ title: '', date: '' });
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
        variant='add-task'
        value={value.title}
        label='Добавить задачу'
        onChange={handleValueChange('title')}
        onClick={handleSubmit}
        onKeyDown={handleKeyDown}
      />

      <TaskInput
        variant='add-task'
        value={value.date}
        label='Дата выполнения'
        onChange={handleValueChange('date')}
        onClick={handleSubmit}
        type='date'
      />
    </fieldset>
  );
};
