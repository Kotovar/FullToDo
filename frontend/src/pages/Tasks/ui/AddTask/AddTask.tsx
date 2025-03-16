import { useState } from 'react';
import { clsx } from 'clsx';
import { Input } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { COLORS, Icon } from '@shared/ui/Icon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateTask } from 'shared/schemas';
import { taskService } from '@features/Tasks';
import { useParams } from 'react-router';

interface TaskOptions {
  title: string;
  date?: string;
}

export const AddTask = () => {
  const { notepadId = '' } = useParams();
  const [value, setValue] = useState<TaskOptions>({
    title: '',
    date: notepadId === 'today' ? new Date() : '',
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (task: CreateTask) => taskService.createTask(task, notepadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleValueTitle: React.ChangeEventHandler<HTMLInputElement> = e => {
    setValue({ ...value, title: e.target.value });
  };

  const handleValueDate: React.ChangeEventHandler<HTMLInputElement> = e => {
    setValue({ ...value, date: e.target.value });
  };

  const createTask = (task: CreateTask) => {
    mutation.mutate(task);
  };

  const handleClick = () => {
    setValue({ title: '', date: '' });
    createTask({
      title: value.title,
      dueDate: value?.date ? new Date(value?.date) : undefined,
    });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && value.title) {
      createTask({
        title: value.title,
        dueDate: value?.date ? new Date(value?.date) : undefined,
      });
      setValue({ title: '', date: '' });
    }
  };

  const baseWrapperContainerStyles =
    'shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-grey-light justify-between gap-2 p-2 rounded grid';

  const inputStyles = 'min-w-0 outline-0';

  return (
    <>
      <Input
        value={value.title}
        onChange={handleValueTitle}
        onKeyDown={handleKeyDown}
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
        type='date'
        placeholder='Дата выполнения'
        value={value.date}
        onChange={handleValueDate}
        containerClassName={clsx(
          baseWrapperContainerStyles,
          'grid-cols-[auto_1fr_auto]',
        )}
        className={clsx(inputStyles, 'w-fit')}
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
