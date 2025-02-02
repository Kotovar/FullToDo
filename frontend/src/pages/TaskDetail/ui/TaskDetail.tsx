import type { ComponentPropsWithoutRef } from 'react';
import { useNavigate } from 'react-router';
import { TASKS1 } from '@entities/Task';
import { Button, COLORS, Icon, Input, Textarea } from '@shared/ui';
import { Subtasks } from './Subtasks';
import { SubtaskTitle } from './SubtaskTitle';

type TaskDetailProps = ComponentPropsWithoutRef<'div'>;

export const TaskDetail = (props: TaskDetailProps) => {
  const { ...rest } = props;
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div {...rest} className='flex flex-col gap-1 p-1'>
      <Button
        className='self-start'
        appearance='primary'
        onClick={handleGoBack}
      >
        Назад
      </Button>
      <SubtaskTitle task={TASKS1[0]} />
      <Subtasks subtasks={TASKS1[1]?.subtasks} />
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
      <Textarea placeholder='Описание'></Textarea>
    </div>
  );
};
