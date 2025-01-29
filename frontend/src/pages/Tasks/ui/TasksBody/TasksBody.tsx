import { useParams } from 'react-router';

import { clsx } from 'clsx';

import { TASKS1, TASKS2, TASKS3 } from '@entities/Task';
import { LinkCard } from '@shared/ui/LinkCard';
import { COLORS, Icon } from '@shared/ui/Icon';

export const TasksBody = () => {
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
        <ul
          className={clsx('flex flex-col gap-2', {
            ['hidden']: taskIds,
          })}
        >
          {tasks.map(({ name, progress, id }) => (
            <LinkCard
              className={clsx(
                'hover:bg-accent-light grid grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-sm p-4 text-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]',
                {
                  ['bg-bg-second']: id === Number(taskIds),
                  ['bg-white']: id !== Number(taskIds),
                },
              )}
              path={
                taskIds && Number(taskIds) === id
                  ? `/notepad/${notepadId}`
                  : `/notepad/${notepadId}/task/${id}`
              }
              cardTitle={name}
              header={
                <div>
                  <Icon name='circleEmpty' size={32} stroke={COLORS.ACCENT} />
                </div>
              }
              body={
                <div className='flex flex-col'>
                  <span className='text-sm'>{progress}</span>
                </div>
              }
              key={id}
            />
          ))}
        </ul>
      ) : (
        <span className='text-center'>Не найдено ни одной задачи</span>
      )}
    </div>
  );
};
