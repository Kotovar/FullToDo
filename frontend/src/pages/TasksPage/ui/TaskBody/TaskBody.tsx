import { useParams } from 'react-router';

import { clsx } from 'clsx';

import { TASKS1, TASKS2, TASKS3 } from '@shared/mock';
import { TaskList } from '../TaskList';

export const TaskBody = () => {
  const { notepadId, taskIds } = useParams();

  const tasks =
    notepadId === '1'
      ? TASKS1
      : notepadId === '2'
        ? TASKS2
        : notepadId === '3'
          ? TASKS3
          : '';

  return (
    <div className='overflow-y-auto'>
      {tasks ? (
        <TaskList
          tasks={tasks}
          className={clsx('flex flex-col gap-2', {
            ['hidden']: taskIds,
          })}
        />
      ) : (
        <span className='text-center'>Не найдено ни одной задачи</span>
      )}
    </div>
  );
};
