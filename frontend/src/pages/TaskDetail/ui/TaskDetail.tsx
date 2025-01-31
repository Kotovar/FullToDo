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
      <Button
        className='self-start'
        appearance='primary'
        onClick={handleGoBack}
      >
        Назад
      </Button>
      <SubtaskTitle task={TASKS1[0]} />
      <P size='l'>{`Это детали задачи ${taskIds}`}</P>
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
