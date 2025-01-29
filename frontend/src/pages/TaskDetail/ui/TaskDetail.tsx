import type { ComponentPropsWithoutRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { TASKS1 } from '@entities/Task';
import { Button } from '@shared/ui/Button';
import { Subtasks } from './Subtasks';
import { P } from '@shared/ui/P';
import { Input } from '@shared/ui/Input';
import { Textarea } from '@shared/ui/Textarea';
import { SubtaskTitle } from './SubtaskTitle';
import { COLORS, Icon } from '@shared/ui/Icon';

type Props = ComponentPropsWithoutRef<'div'>;

export const TaskDetail = (props: Props) => {
  const { ...rest } = props;
  const { taskIds } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div {...rest} className='flex flex-col gap-1 p-1'>
      <Button appearance='primary' onClick={handleGoBack}>
        Назад
      </Button>
      <SubtaskTitle task={TASKS1[0]} />
      <P size='l'>{`Это детали задачи ${taskIds}`}</P>
      <Subtasks subtasks={TASKS1[1]?.subtasks} />
      <Input placeholder='Следующий шаг' iconName='plus' type='text' />
      <div className='flex items-center gap-2 p-1'>
        <button type='button'>
          {<Icon name='calendar' stroke={COLORS.ACCENT} />}
        </button>
        <input type='datetime-local' className='outline-0' />
      </div>
      <Textarea placeholder='Описание'></Textarea>
    </div>
  );
};
