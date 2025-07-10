import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateTask } from '@entities/Task';
import { TaskInput } from '@shared/ui';
import type { TaskOptions } from '@pages/Tasks/lib';

interface AddTaskProps {
  notepadId: string;
}

export const AddTask = memo(({ notepadId }: AddTaskProps) => {
  const [value, setValue] = useState<TaskOptions>({
    title: '',
    date: '',
  });

  const { t } = useTranslation();

  const { createTask } = useCreateTask({
    notepadId,
    entity: 'tasks',
  });

  const handleValueChange =
    (field: keyof TaskOptions) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async () => {
    if (!value.title.trim()) return;

    await createTask({
      title: value.title,
      dueDate: value?.date ? new Date(value?.date) : undefined,
    });

    setValue({ title: '', date: '' });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <fieldset className='flex flex-col gap-2'>
      <legend className='sr-only'>{t('tasks.create')}</legend>

      <TaskInput
        variant='add-task'
        value={value.title}
        label={t('tasks.add')}
        onChange={handleValueChange('title')}
        onClick={handleSubmit}
        onKeyDown={handleKeyDown}
      />

      <TaskInput
        variant='add-task'
        value={value.date}
        label={t('tasks.date')}
        onChange={handleValueChange('date')}
        onClick={handleSubmit}
        type='date'
      />
    </fieldset>
  );
});
