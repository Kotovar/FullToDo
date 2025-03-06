import type { ComponentPropsWithoutRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, COLORS, Icon, Input, Textarea } from '@shared/ui';
import { Subtasks } from './Subtasks';
import { SubtaskTitle } from './SubtaskTitle';
import { useQuery } from '@tanstack/react-query';
import { fetchSingleTask } from '@entities/Task/api';

type TaskDetailProps = ComponentPropsWithoutRef<'div'>;

export const TaskDetail = (props: TaskDetailProps) => {
  const { ...rest } = props;
  const { notepadId = '', taskId = '' } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const { data, isError } = useQuery({
    queryKey: ['task', taskId, notepadId],
    queryFn: () => fetchSingleTask(taskId, notepadId),
  });

  if (isError) {
    return <div>Error fetching data</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const tasksDate = data?.data ?? [];

  return (
    <div {...rest} className='flex flex-col gap-1 p-1'>
      <Button
        className='self-start'
        appearance='primary'
        onClick={handleGoBack}
      >
        Назад
      </Button>
      <SubtaskTitle task={tasksDate[0]} />
      <Subtasks subtasks={tasksDate[0].subtasks ?? []} />
      <Input
        placeholder='Следующий шаг'
        type='text'
        containerClassName='flex items-center gap-2 p-1'
        className='w-full outline-0'
        leftContent={
          <Button appearance='ghost'>
            <Icon name='plus' stroke={COLORS.ACCENT} />
          </Button>
        }
      />
      <Input
        placeholder='Укажите дату'
        type='text'
        containerClassName='flex items-center gap-2 p-1'
        className='w-full outline-0'
        leftContent={
          <Button appearance='ghost'>
            <Icon name='calendar' stroke={COLORS.ACCENT} />
          </Button>
        }
      />
      <Textarea
        className='outline-bg-second w-full rounded-sm bg-white p-2'
        placeholder='Описание'
      ></Textarea>
    </div>
  );
};
