import type { ComponentPropsWithoutRef } from 'react';
import { useNavigate } from 'react-router';
import { TASKS1 } from '@shared/mock';
import EmptyCircleIcon from './circle-empty.svg?react';
import FilledCircleIcon from './circle-filled.svg?react';
import CrossIcon from './cross.svg?react';
import PlusIcon from './plus.svg?react';
import CalendarIcon from './calendar.svg?react';

interface Props extends ComponentPropsWithoutRef<'div'> {
  taskId: string;
}

export const TaskDetail = (props: Props) => {
  const { taskId, ...rest } = props;
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div {...rest} className='flex h-full list-none flex-col gap-1 p-1'>
      <button
        onClick={handleGoBack}
        className='bg-accent rounded px-4 py-2 text-white'
      >
        Назад
      </button>
      <span className='flex gap-2 p-1'>
        <EmptyCircleIcon className='h-6 w-6' />
        {TASKS1.at(0)?.name}
      </span>
      <p className='p-1'>{`Это детали задачи ${taskId}`}</p>
      <ul className='flex list-none flex-col'>
        {TASKS1[0]?.subtasks.map(({ completed, title }, i) => {
          return (
            <li
              key={i}
              className='odd:bg-bg-second even:bg-grey-light grid grid-cols-[1rem_1fr_1rem] items-center gap-4 p-2'
            >
              <span>
                {completed ? (
                  <FilledCircleIcon className='h-6 w-6' />
                ) : (
                  <EmptyCircleIcon className='h-6 w-6' />
                )}
              </span>
              <span>{title}</span>
              <button type='button'>
                <CrossIcon className='h-6 w-6' />
              </button>
            </li>
          );
        })}
      </ul>
      <div className='flex gap-2 p-1'>
        <PlusIcon className='h-6 w-6' />
        <input type='text' placeholder='Следующий шаг' />
      </div>
      <div className='flex gap-2 p-1'>
        <CalendarIcon className='h-6 w-6' />
        <button type='button'>Указать дату</button>
      </div>
      <textarea
        className='bg-grey-light rounded-sm p-2'
        placeholder='Описание'
      ></textarea>
    </div>
  );
};
