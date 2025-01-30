import type { ComponentPropsWithoutRef } from 'react';
import { useNavigate, useParams } from 'react-router';

import { COLORS, Icon } from '@shared/ui/Icon';
import { Button } from '@shared/ui/Button';
import { Subtasks } from './Subtasks';
import { P } from '@shared/ui/P';
import { Input } from '@shared/ui/Input';
import { Textarea } from '@shared/ui/Textarea';
import { TASKS1 } from '@entities/Task';

type Props = ComponentPropsWithoutRef<'div'>;

export const TaskDetailPage = (props: Props) => {
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
      <span className='flex gap-2 p-1'>
        <Icon name='circleEmpty' stroke={COLORS.ACCENT} />
        {TASKS1.at(0)?.name}
      </span>
      <P size='l'>{`Это детали задачи ${taskIds}`}</P>
      <Subtasks subtasks={TASKS1[0]?.subtasks} />
      <Input placeholder='Следующий шаг' iconName='plus' />
      <div className='flex gap-2 p-1'>
        <Icon name='calendar' stroke={COLORS.ACCENT} />
        <button type='button'>Указать дату</button>
      </div>
      <Textarea placeholder='Описание'></Textarea>
    </div>
  );
};
